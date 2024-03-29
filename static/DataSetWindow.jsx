
/**
 * ====================================================================================================
 *                                          PROJECT/DATASET SELECTOR REACT
 * ====================================================================================================
 * Project/Dataset selector React Object.
 */

 // Component for each individual project/dataset tile
class ListTile extends React.Component {
    constructor(props) {
        super()
        this.props = props
        this.state = {
            selected: this.props.active,
            thumbnail: "",
            orientation: "Landscape" 
        }
        
        if (this.props.dataType == 'project') {

            var image_url = `./static/data/${this.props.name}/${this.props.name}_thumbnail.gif`

            var http = new XMLHttpRequest();
            http.open('HEAD', image_url, false); //TODO: [Deprecation] Synchronous XMLHttpRequest
            http.send();
            if(http.status != 404)
            {
                this.state.thumbnail = image_url;
            }
            else
            {
                this.state.thumbnail = './static/assets/movie.png';
            }
        }
        else
        {
            this.state.thumbnail = './static/assets/movie.png';
        }
    }

    set_thumbnail(thumb) {
        this.state.thumbnail = thumb;
    }

    set_orientation(orient) {
        this.state.orientation = orient;
    }

    loadData = (e) => {
        if (interfaceManager.toolbarManager.projectManager.currentProject.dataset == this.props.name) {
            return undefined
        }
        if ($('.ListTileHighlight')[0] !== undefined) {
            $('.ListTileHighlight')[0].classList.remove('ListTileHighlight')
        }

        processManager.getDataset(this.props.name)
        var dataset = interfaceManager.toolbarManager.projectManager.currentProject.dataset
        document.getElementById(dataset + '-dataset-tile').classList.add('ListTileHighlight')
        $('.dataset-btn')[0].innerText = dataset

        // Hide Dataset Selection Dialog
        interfaceManager.mainScreenManager.dataPanelManager.dataToolReact.hideDialogDatasetList(e);
    }

    loadDataProject = (e) => {
        console.log(this.props.name)
        $('.project-btn')[0].innerHTML = this.props.name

        if ($('.ListTileHighlight')[0] !== undefined) {
            $('.ListTileHighlight')[0].classList.remove('ListTileHighlight')
        }

        // getVideoMetaData includes FPS
        // // Request server to compute video FPS
        // $.ajax({
        //     url: '/getFPS/' + this.props.name,
        //     dataType: 'text',
        //     async: false,
        //     success: function(fps){
        //         variableManager.config.FRAMES_PER_SECOND = Number(fps);
        //     }
        // });

        // Request server to compute video FPS
        $.ajax({
            url: '/getVideoMetadata/' + this.props.name,
            dataType: 'json',
            async: false,
            success: function(metadata){
                variableManager.videoMetaData = metadata;
                variableManager.config.FRAMES_PER_SECOND = Number(metadata['fps']);
                variableManager.processVariables();
                variableManager.configToStyle();
                
                console.log(metadata);
            }
        });

        interfaceManager.toolbarManager.projectManager.getProject(this.props.name)
        document.getElementById(this.props.name).classList.add('ListTileHighlight')

        // Hide Project Selection Dialog
        globalProjDatasetDialog.hideDialogProjectList(e);
    }


    render() {

        if (this.props.dataType == 'project') {
            return (
                <div id={this.props.name} title={this.props.name}
                    className={`ListTile ${interfaceManager.toolbarManager.projectManager.currentProject.name == this.props.name ? 'ListTileHighlight' : ''}`}
                    onClick={this.loadDataProject}>

                    <img id={`thumbnail_${this.props.name}`} src={this.state.thumbnail} style={{ height: '50%'}}
                        alt="Logo" />

                    <div style={{
                            fontSize: '13px',
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                        {this.props.name}
                    </div>

                </div>

            );
        } else {
            return (
                <div
                    className={`ListTile ${interfaceManager.toolbarManager.projectManager.currentProject.dataset == this.props.name ? 'ListTileHighlight' : ''}`}
                    id={this.props.name + '-dataset-tile'}
                    onClick={this.loadData}>
                    <div>
                        <img src={'./static/assets/dat_icon.png'} alt="Logo" style={{ width: '90%', height: '100px' }} />
                    </div>
                    <div style={{
                            fontSize: '13px',
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                        {this.props.name}
                    </div>
                </div>

            );
        }
    }
}

// View contains all project/dataset tiles
class ListView extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        var items = [];
        if (this.props.dataType == 'project') {
            items.push(<AddProject name={"Add New Project"} />)
        }
        this.props.projects.forEach(element => {
            items.push(
                <ListTile name={element} dataType={this.props.dataType} />
            )
        });

        return (
            <div className="dialog-row-container">
                {items}
            </div>
        );
    }

}

//Selector main container
class TileDiv extends React.Component {
    constructor(props) {
        super()
        this.props = props
        this.state = {
            no_cols: 1
        }
    }

    render() {
        return (
            <div
                className='dailog-fixed-height-container'
                id={'fixedHeight'}
                onClick={(e) => e.stopPropagation()}>
                <ListView projects={this.props.list} dataType={this.props.dataType} />
            </div>
        )
    }
}


class AddProject extends React.Component {
    constructor(props) {
        super()
        this.props = props
    }
    render() {
        return (
            <div
                className={'ListTile'}
                onClick={(e) => globalProjDatasetDialog.showDialogNewProject(e)} >
                <div>
                    <img src={`./static/assets/add_plus.png`} alt="Logo" style={{ width: '50%', height: "auto" }} />
                </div>
                <div>
                    <p
                        style={{
                            fontSize: '13px',
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginTop: "36%"

                        }}>
                        {this.props.name}
                    </p>
                </div>

            </div>

        );
    }
}

