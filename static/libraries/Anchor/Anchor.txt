
/**
 * ====================================================================================================
 *                                      ANCHOR JAVASCRIPT OBJECTS
 * ====================================================================================================
 * Anchor class object.
 */
class Anchors {
    /**
     * Anchor Object constructor.
     */
    constructor() {
        this.anchors = {};
    }
    /**
     * Clears every thing inside the anchors.
     */
    clear() {
        this.anchors = {};
    }
    /**
     * Initialize anchors on new dataset entry
     */
    initialize(datasets) {
        for (let i in datasets) {
            let track = datasets[i]
            this.anchors[i] = [];
            for (let id in track) {
                let label = track[id]
                this.anchors[i].push(label.getStartTimeMS());
                this.anchors[i].push(label.getEndTimeMS());
            }
        }
    }
    /**
     * Update track on change.
     */
    updateAnchors(track, track_id) {
        this.anchors[track_id] = [];
        for (let id in track) {
            let label = tracks[id]
            this.anchors[i].push(label.getStartTimeMS());
            this.anchors[i].push(label.getEndTimeMS());
        }
    }
    /**
     * Get anchor on id.
     */
    getAnchorsByID(track_id) {
        return this.anchors[track_id];
    }
    /**
     * Get all anchors.
     */
    getAllAnchors() {
        return this.anchors;
    }
};