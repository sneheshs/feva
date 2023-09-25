/**
 * Manager for projects.
 */
class ProjectManagerA {
    /**
     * Constructor.
     */
    constructor() {
        this.projects = {}
    }

    /**
     * Set default angle for current project
     * @param {String} dir Project directory.
     * @param {number} angle Default angle.
     */
    setDefaultAngle(dir, angle) {
        try {
            this.projects[dir].defaultangle = angle;
            variableManager.config.PROJECT_LIST[interfaceManager.toolbarManager.projectManager.currentProject.name].default_angle = angle;
        }
        catch (err) {
            this.projects[dir] = {};
            variableManager.config.PROJECT_LIST[interfaceManager.toolbarManager.projectManager.currentProject.name] = {};
            this.projects[dir].defaultangle = angle;
            variableManager.config.PROJECT_LIST[interfaceManager.toolbarManager.projectManager.currentProject.name].default_angle = angle;
        }
    }
    /**
     * Set default dataset for current project
     * @param {String} dir Project directory.
     * @param {String} dataset Default dataset.
     */
    setDefaultDataset(dir, dataset) {
        try {
            this.projects[dir].defaultdataset = dataset;
            variableManager.config.PROJECT_LIST[interfaceManager.toolbarManager.projectManager.currentProject.name].default_dataset = dataset;
        }
        catch (err) {
            this.projects[dir] = {};
            this.projects[dir].defaultdataset = dataset;
            variableManager.config.PROJECT_LIST[interfaceManager.toolbarManager.projectManager.currentProject.name].default_dataset = {};
            variableManager.config.PROJECT_LIST[interfaceManager.toolbarManager.projectManager.currentProject.name].default_dataset = dataset;
        }
    }
}