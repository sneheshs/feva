/**
 * ====================================================================================================
 *                                          DATA PANEL REACT
 * ====================================================================================================
 * Data panel React Object.
 */
class DataPanel extends React.Component {

    constructor(props) {
        super(props);
        let container = undefined;
        let selectBox = undefined;
    };
    /**
     * Render Data panel display.
     */
    render() {
        return (
            <div className={'data-panel-container'}>
                <DataToolReact />
                <input className={'search-bar'} type={'text'}
                    onInput={interfaceManager.mainScreenManager.dataPanelManager.find} />
                <div className={'label-list scrollbar'} />
            </div>
        )
    }
}

/**
 * Datatool React Object.
 */
class DataToolReact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDatasetListDialog: false
        }
        interfaceManager.mainScreenManager.dataPanelManager.dataToolReact = this;
    }
    // state for dataset window   
    showDialogDatasetList = (e) => {
        // this.state.showDatasetListDialog = true
        // console.log(this.state.showDatasetListDialog)
        this.setState({
            showDatasetListDialog: true
        })
    }
    hideDialogDatasetList = (e) => {
        // this.state.showDatasetListDialog = true
        // console.log(this.state.showDatasetListDialog)
        this.setState({
            showDatasetListDialog: false
        })
    }


    /**
     * Render Data tool.
     */
    render() {

        return (
            <div className={'datatool-container'}>
                <div className={'select-dataset-container'}>
                    <button
                        onClick={(e) => {
                            this.showDialogDatasetList()
                        }}
                        className={'dataset-btn'}>Select Dataset</button>
                </div>
                {this.state.showDatasetListDialog ? 
                <div className={'dialog-box'} style={{ marginTop: '20px' }}>
                    <div id={'dialog-click-container'}
                        onClick={(e) => {
                            if (e.target.id !== 'fixedHeight'){
                                this.setState({
                                    showDatasetListDialog : false
                                })
                            }
                        }}>
                       <TileDiv list={interfaceManager.mainScreenManager.dataPanelManager.dataSetList} dataType = {'data'}/>
                    </div>
                </div> : null}
                <button className={`datapanel-button save`}
                    onClick={processManager.buttons['save']} />
                <button className={`datapanel-button save-as`}
                    onClick={() => { $('.save-as-container').toggle(); }} />
                <div className={"dropdown-filter"}>
                    <span className={"anchor"}
                        onClick={() => { $('.filter-list').toggle(); }} />
                    <ul className={"filter-list"} />
                </div>
                <div className={'save-as-container'}>
                    <input type={'text'} className={'save-as-input'} />
                    <button onClick={processManager.buttons['save-as']}>{'Save As'}</button>
                </div>
            </div>

        )
    }
}

/**
 * ====================================================================================================
 *                                          DATA PANEL MANAGER
 * ==================================================================================================== 
 * Manager for data panel.
 */
class DataPanelManager {
    /**
     * Constructor.
     */
    constructor() {
        this.dataSetList = []
        this.dataToolReact = undefined;
    }
    /**
     * Find function for search bar.
     * @param {Event} e Event.
     */
    find(e) {
        // 1. Get parsed search value.
        const rgx = new RegExp(e.target.value, 'gi');
        // 2. Parse every label.
        $('.label-display').map(function () {
            // 2.1. If label search is not same as parsed hide label.
            if (this.innerText.match(rgx) == null) {
                $(this).hide();
            }
            // 2.2. Else if label is not filtered show label.
            else {
                let filter_settings = $(`.filter-${$(this).data('type')}`).is(":checked");
                filter_settings ? $(this).show() : $(this).hide();
            }
        })
    }
    /**
     * Filters label based on checked type.
     * @param {number} type Color type.
     * @param {boolean} checked Type is checked or not.
     */
    filter(type, checked) {
        // 1. Get parsed search value.
        const rgx = new RegExp($('.search-bar').val(), 'gi');
        // 2. Parse every label.
        $('.label-display').map(function () {
            // 2.1. If label text matches parse value and type is nor filtered show.
            if (this.innerText.match(rgx) != null && $(this).data('type') == type) {
                checked ? $(this).show() : $(this).hide();
            }
        })
    }
    /**
     * Reset display as new project is fetched.
     */
    reset() {
        // 1. Reset container z index for dataset selection.
        $('.data-panel-container').css('z-index', 400);
        // 2. Disable dataset selection and clears.
        $('.dataset-selection').attr('disabled', true);
        $('.dataset-selection').empty();
        // 3. Clear filter for new dataset colors.
        $('.filter-list').empty();
        // 4. Clear dataset list.
        $('.label-list').empty();
    }
    /**
     * Set datasets list for current project.
     * @param {List} list List of options.
     */
    setDatasetList(list) {
        // 1. Clear dataset selection,
        $('.dataset-selection').empty();
        // 2. Create new dataset selections.
        this.dataSetList = [];
        list.map(dataset => {
            this.dataSetList.push(dataset)
            // return `<option value=${dataset}>${dataset}</option>`;
        })
        // $('.dataset-selection').append(
        //     list.map(dataset => {
        //         this.dataSetList.push(dataset)
        //         return `<option value=${dataset}>${dataset}</option>`;
        //     })
        // );
        // 3. Set dataset selection available.
        $('.dataset-selection').attr('disabled', false);
    }
    /**
     * Add new dataset to current project
     */
    addNewDatasetToList(dataset) {
        // $('.dataset-selection').append(`<option value=${dataset}>${dataset}</option>`);
        $('.dataset-btn')[0].innerText = dataset
        this.dataSetList.push(dataset)
        // document.getElementsByClassName('dataset-selection')[0].value = dataset
    }
    /**
     * Update filter with new list of color.
     */
    updateFilter() {
        // 1. Clear filter list.
        $('.filter-list').empty();
        // 2. Add filters.
        $('.filter-list').append(
            // 2.1. For every colors
            processManager.colorManager.getListOfTypes().map(type => {
                // 2.1.1. Add filter HTML.
                const name = processManager.colorManager.getNameByType(type);
                return `<li class='filter-item-container'>` +
                    `<input class='filter-${name} filter-item' checked type="checkbox" />` +
                    `<span class="filter-text">${processManager.processes['to-capital-letter'](name)}</span>` +
                    `</li>`;
            })
        );
        // 3. Set filter on change to filter label list.
        $('.filter-item').on('change', function () {
            interfaceManager.mainScreenManager.dataPanelManager.filter(this.classList[0].split('-')[1], this.checked);
        })
    }
    /**
     * Update label display.
     */
    updateLabelDisplay() {
        // 1. Clear label list.
        $('.label-list').empty();
        // 2. Add labels.
        $('.label-list').append(
            // 2.1. For every labels
            interfaceManager.dataDisplayManager.labels.getLabelsByTime().map(label => {
                // 2.1.1. If label is deleted then do not show.
                if (label.isDeleted()) return ``;
                // 2.1.2. Else show label.
                return `<div class="type-${label.getType()} label-display" ` + `id="label-display-${label.getID()}" ` +
                    `title="${processManager.processes['s-to-string-ms'](label.getStartTimeS())}" ` +
                    `data-type="${processManager.colorManager.getNameByType(label.getType())}">` +
                    label.getText() +
                    `</div>`;
            })
        )
        // 3. Set label display on event functions.
        $('.label-display')
            // 3.1. Double click to seek label in label canvas.
            .dblclick(function () {
                const label = interfaceManager.dataDisplayManager.labels.getLabelByID(this.id.split('-')[2]);
                processManager.seekScroll(label.getStartTimeS(), 'slow');
            })
            // 3.2. Right click to display context menu for label.
            .contextmenu(function (e) {

                const label = interfaceManager.dataDisplayManager.labels.getLabelByID(this.id.split('-')[2]);
                //const label = interfaceManager.dataDisplayManager.labels.getLabelByID(this.classList[2]);
                interfaceManager.contextMenuManager.setPosition(
                    e,
                    'label',
                    $('.menu.edit'),
                    { id: label.getID(), type: label.getType() }
                )
            })
    }
    /**
     * Update label's color.
     * @param {String} id Label ID.
     * @param {number} type New type.
     */
    updateType(id, type) {
        // 1. Remove label class of previous type.
        $(`#label-display-${id}`).removeClass(function (i, className) {
            return (className.match(/(^|\s)type-\S+/g) || []).join(' ');
        });
        // 2. Add label class of new type.
        $(`#label-display-${id}`).addClass(`type-${type}`);
    }
}
