import xml.etree.ElementTree as ET
import json
import random
from lxml import etree as gfg
import random
import datetime


class ELANtoDAT:
    labels = {}
    dat_obj = {}
    header = {}
    merged = {}

    def __init__(self, file):
        self.tree = ET.parse(file)
        self.root = self.tree.getroot()
        self.dat_obj = {}
        self.labels = {}
        self.units = 'milliseconds'
        self.author = ''
        self.date = ''
        self.version = 0
        self.format = 0

    def generate_color(self):
        def r(): return random.randint(0, 255)
        return ('#%02X%02X%02X' % (r(), r(), r()))

    def parse_data(self):
        time_slots = {}
        SUCCESS = 'SUCCESS'
        FAILURE = 'FAILURE'
        tier_ctn = 1
        meta_data = self.root.attrib
        self.author = meta_data['AUTHOR']
        self.date = meta_data['DATE']
        self.version = meta_data['VERSION']
        self.format = meta_data['FORMAT']
        self.header['date_created'] = self.date
        self.header['date_modified'] = self.date
        self.header['labels'] = self.labels
        self.header['project'] = self.version
        self.header['schema_version'] = self.version
        self.header['version'] = self.version

        try:
            for elem in self.root:
                if elem.tag == 'HEADER':
                    header_attrib = elem.attrib
                    self.units = header_attrib['TIME_UNITS']
                if elem.tag == 'TIME_ORDER':
                    for i in elem:
                        if i.tag == 'TIME_SLOT':
                            cur = i.attrib
                            time_slots[cur['TIME_SLOT_ID']] = cur['TIME_VALUE']
                if elem.tag == 'TIER':
                    cur_tier = elem.attrib

                    # TODO: Repetition isn't supported currently
                    if elem.attrib['LINGUISTIC_TYPE_REF'] == 'Repetition':
                        continue

                    for i in elem:
                        annot_obj = i.getchildren()[0].attrib
                        self.dat_obj[annot_obj['ANNOTATION_ID']] = [
                            tier_ctn,
                            time_slots[annot_obj['TIME_SLOT_REF1']],
                            time_slots[annot_obj['TIME_SLOT_REF2']],
                            i.getchildren()[0].getchildren()[0].text
                        ]
                    self.labels[cur_tier['TIER_ID']] = [
                        tier_ctn, self.generate_color()]
                    tier_ctn += 1

            self.merged['data'] = self.dat_obj
            self.merged['header'] = self.header
            return SUCCESS
        except Exception as e:
            return FAILURE

    def save_json(self):
        with open("import_from_ELAN.dat", "w") as outfile:
            json.dump(self.merged, outfile, indent=4)


class DATtoELAN:

    # 1. Parse dat
    def __init__(self):
        self.time_label = {}
        self.tiers = {}

    def parse_time(self, data):
        time_lst = []
        for i in data:
            time = data[i][1]
            if time not in time_lst:
                time_lst.append(time)
            time = data[i][2]
            if time not in time_lst:
                time_lst.append(time)
        time_lst.sort()
        for i in range(len(time_lst)):
            if time_lst[i] not in self.time_label:
                self.time_label[time_lst[i]] = 'ts'+str(i)

    def parse_tiers(self, data, labels):
        mapping = {}
        for i in labels:
            self.tiers[i] = {}
            mapping[int(labels[i][0])] = i
        for i in data:
            tier = mapping[data[i][0]]
            self.tiers[tier][i] = data[i]

    def conversion(self, file_name):
        # INITIAL HEADINGS
        root = gfg.Element("ANNOTATION_DOCUMENT")
        root.set('AUTHOR', 'TEST_AUTHOR')
        # set to current date and time
        root.set('DATE', str(datetime.datetime.now()))
        root.set('FORMAT', 'X.x')
        tree = gfg.ElementTree(root)

        # set namespace attributes
        NSMAP = {'xsi': 'http://www.w3.org/2001/XMLSchema-instance'}
        attr_qname = gfg.QName(
            "http://www.w3.org/2001/XMLSchema-instance", "noNamespaceSchemaLocation")
        # set header and its attributes
        header = gfg.Element("HEADER",
                             {attr_qname: 'http://www.mpi.nl/tools/elan/EAFv3.0.xsd'},
                             nsmap=NSMAP)
        header.set('MEDIA_FILE', '')
        header.set('TIME_UNITS', 'milliseconds')
        root.append(header)

        # set media descriptor
        media_descriptor = gfg.Element('MEDIA_DESCRIPTOR')
        media_descriptor.set('MEDIA_URL', self.media_desc)
        media_descriptor.set('MIME_TYPE', self.media_desc)
        media_descriptor.set('RELATIVE_MEDIA_URL', self.media_desc)
        header.append(media_descriptor)

        # set time
        time_order = gfg.Element('TIME_ORDER')
        for key, val in self.time_label.items():
            time_slot = gfg.Element('TIME_SLOT')
            time_slot.set('TIME_SLOT_ID', val)
            time_slot.set('TIME_VALUE', str(int(key)))
            time_order.append(time_slot)

        root.append(time_order)

        # set tiers
        # ALL DAT FILES WILL BE ENGLISH AND WITHOUT COMPLIMENTARY PARTICIPANT
        # NOT ACCOUNTING FOR REPETITION LINGUISTIC_TYPE_REF
        for key, val in self.tiers.items():
            tier_tag = gfg.Element('TIER')
            tier_tag.set('DEFAULT_LOCALE', 'en')
            tier_tag.set('LINGUISTIC_TYPE_REF', 'Default')
            tier_tag.set('PARTICIPANT', '')
            tier_tag.set('TIER_ID', key)
            for inner_key, inner_val in val.items():
                annotation_tag = gfg.Element('ANNOTATION')
                align_annot_tag = gfg.Element('ALIGNABLE_ANNOTATION')
                align_annot_tag.set('ANNOTATION_ID', inner_key)
                align_annot_tag.set('TIME_SLOT_REF1', str(
                    self.time_label[inner_val[1]]))
                align_annot_tag.set('TIME_SLOT_REF2', str(
                    self.time_label[inner_val[2]]))
                annot_val = gfg.Element('ANNOTATION_VALUE')
                annot_val.text = inner_val[3]

                align_annot_tag.append(annot_val)
                annotation_tag.append(align_annot_tag)
                tier_tag.append(annotation_tag)
            root.append(tier_tag)

        # set language type
        # setting default hard coded values
        ling_type_1 = gfg.Element('LINGUISTIC_TYPE')
        ling_type_1.set('GRAPHIC_REFERENCES', 'false')
        ling_type_1.set('LINGUISTIC_TYPE_ID', 'Default')
        ling_type_1.set('TIME_ALIGNABLE', 'true')
        root.append(ling_type_1)

        ling_type_2 = gfg.Element('LINGUISTIC_TYPE')
        ling_type_2.set('CONSTRAINTS', 'Symbolic_Association')
        ling_type_2.set('GRAPHIC_REFERENCES', 'false')
        ling_type_2.set('LINGUISTIC_TYPE_ID', 'Repetition')
        ling_type_2.set('TIME_ALIGNABLE', 'false')

        with open(file_name + '.eaf', "wb") as files:
            tree.write(files, pretty_print=True,
                       xml_declaration=True, encoding='UTF-8')

    def clear_val(self):
        self.parse_tiers = {}
        self.parse_time = {}
        self.media_desc = None

    def parse_data(self, directory, media_desc, file_name):
        data = json.load(open(directory))
        self.parse_time(data['data'])
        self.parse_tiers(data['data'], data['header']['labels'])
        self.media_desc = media_desc
        self.conversion(file_name)
        self.clear_val()


class ELAN:
    def __init__(self):
        # self.import_elan = ELANtoDAT('./test_data/test_file.eaf')
        self.export_elan = DATtoELAN()
        
    # .eaf -> .dat OR xml structure -> json structure
    def importFromELAN(self):
        self.import_elan.parse_data()
        self.import_elan.save_json()
        return 1

    # .dat -> .eaf OR json structure -> xml structure
    def exportToELAN(self, directory, media_desc, file_name):
        self.export_elan.parse_data(directory, media_desc, file_name)

