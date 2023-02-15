/**
 * Manager for colors.
 */
class ColorManager {
    /**
     * Color box constructor
     */
    constructor() {
        this.colors = {};
    }
    /**
     * Initialize color list.
     * @param {List} colorList List of color from dataset.
     */
    initializeColors(colors) {
        this.colors = {};
        let styles = ''
        for (let i in colors) {
            this.colors[i] = new Color(i, colors[i][0], colors[i][1]);
            styles += `.type-${i}{background: ${colors[i][1]};} `;
            styles += `.type-${i}.darken{background: ${colors[i][1]}55;} `;
        }
        $('#proj-style').remove();
        $('head').append(
            '<style id="proj-style" type="text/css">' +
            styles +
            '</style>'
        );
    }
    /**
     * Create new type with no overlaps.
     * @param {String} name New color name.
     * @param {String} color New color hexstring.
     */
    createNewType(name, color) {
        let pool = Object.keys(this.colors)
        let i = 0;
        while (pool.includes(i.toString())) {
            i++;
        }
        this.colors[i] = new Color(i.toString(), name, color); //str.substring(1) removes # from color hexstring
        interfaceManager.updateDisplayPostNewTypeAddition(i);
        processManager.xhrManager.writeDataset(
            'new-track',
            new Color(i.toString(), name, color.substring(1)) //i.toString()
        )
        let styles = ''
        for (let i in this.colors) {
            styles += `.type-${i}{background: ${this.colors[i].color};} `;
            styles += `.type-${i}.darken{background: ${this.colors[i].color}55;} `;
        }
        $('#proj-style').remove();
        $('head').append(
            '<style id="proj-style" type="text/css">' +
            styles +
            '</style>'
        );
    }
    /**
     * Delete color by type.
     * @param {number} type Color type.
     */
    deleteColorByType(type) {
        delete this.colorList[type];
    }
    /**
     * Get color by type.
     * @param {number} type Color type.
     */
    getColorByType(type) {
        let color = this.colors[type];
        if (color == undefined) return undefined;
        else return color.getColor();
    }
    /**
     * Get color name by type.
     * @param {number} type Color type.
     */
    getNameByType(type) {
        let color = this.colors[type];
        if (color == undefined) return undefined;
        else return color.getName();
    }
    /**
     * Get list of color types.
     */
    getListOfTypes() {
        return Object.keys(this.colors);
    }

    /**
     * Get RGB color for type.
     * @param {type} Type
     */
    getRGBByType(type) {
        const track = $(`.track-panel.type-${type}`)[0];
        if (track) {
            const rgbString = window.getComputedStyle(track).backgroundColor;
            const regex = /\d+/g;
            const arr = rgbString.match(regex);
            return {red : arr[0], green: arr[1], blue: arr[2]}
        }
        return undefined;
    }

    /**
     * Get ordering number for type.
     * @param {number} type Type.
     */
    getTypeOrdering(type) {
        if (type == undefined) return -1;
        return this.getListOfTypes().indexOf(type.toString());
    }
    // STORED FUNCTIONS FOR LATER USES.
    // /**
    //  * Getters
    //  */
    // getTypeByName(name) {
    //     let labelColor;
    //     for (let obj in this.colorList) {
    //         if (this.colorList[obj].getName() == name) labelColor = this.colorList[obj]
    //     }
    //     if (labelColor == undefined) return undefined;
    //     else return labelColor.getType();
    // }
    // getTypeByColor(color) {
    //     let labelColor;
    //     for (let obj in this.colorList) {
    //         if (this.colorList[obj].getColor() == color) labelColor = this.colorList[obj]
    //     }
    //     if (labelColor == undefined) return undefined;
    //     else return labelColor.getType();
    // }
    // getNameByColor(color) {
    //     let labelColor;
    //     for (let obj in this.colorList) {
    //         if (this.colorList[obj].getColor() == color) labelColor = this.colorList[obj]
    //     }
    //     if (labelColor == undefined) return undefined;
    //     else return labelColor.getName();
    // }
    // getColorByName(name) {
    //     let labelColor;
    //     for (let obj in this.colorList) {
    //         if (this.colorList[obj].getName() == name) labelColor = this.colorList[obj]
    //     }
    //     if (labelColor == undefined) return undefined;
    //     else return labelColor.getColor();
    // }
    // getNumberOfTypes() {
    //     return Object.keys(this.colorList).length;
    // }
    // /**
    //  * Setters.
    //  */
    // setNameByName(oldName, newName, trackDIV) {
    //     for (let i in this.colorList) {
    //         if (this.colorList[i].getName() == oldName) {
    //             this.colorList[i].setName(newName);
    //         }
    //     }
    //     menuManager.updateMenu();
    //     menuManager.updateFilter();
    //     trackDIV.innerText = newName;
    //     xhrWriteDataset.open('GET', `/changeTrackName/${currentVideoDirectory}/${currentVideoName}/${oldName}/${newName}`);
    //     xhrWriteDataset.send();
    // }
    // setIroCurrentColor(color) {
    //     this.iroColor.color.set(color);
    // }
    // setIroOnColorChange(div) {
    //     this.iroColor
    //         .off('color:change')
    //     this.iroColor
    //         .on('color:change',
    //             function (color) {
    //                 $(div).css({
    //                     background: color.hexString,
    //                 })
    //             })
    // }
}

/**
 * Color object.
 */
class Color {
    /**
     * Label Color constructor
     * @param {number} type Label Color Type
     * @param {String} name Label Color Name
     * @param {String } color Label Color color
     */
    constructor(type, name, color) {
        this.type = type;
        this.name = name;
        this.color = color;
    }
    /**
     * Getters
     */
    getType() {
        return this.type;
    }
    getName() {
        return this.name;
    }
    getColor() {
        return this.color;
    }
    /**
     * Setters
     */
    setType(type) {
        this.type = type;
    }
    setName(name) {
        this.name = name;
    }
    setColor(color) {
        this.color = color;
    }
}