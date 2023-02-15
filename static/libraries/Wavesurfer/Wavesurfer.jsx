// Move const to a file
const WAVEFORM_COLOR = "violet";
const WAVEFORM_CONTAINER_HEIGHT = 50;
const WAVEFORM_PROGRESS_COLOR = 'purple';
const WAVEFORM_NORMALIZE = true;


// Wavesurfer constructor.
const AudioWaves = () => {
    React.useEffect(() => {
        processManager.audioWavesManager = WaveSurfer.create({
            container: '#waveform',
            waveColor: WAVEFORM_COLOR,
            height: WAVEFORM_CONTAINER_HEIGHT,
            progressColor: WAVEFORM_PROGRESS_COLOR,
            normalize: WAVEFORM_NORMALIZE
        });
        processManager.audioWavesManager.zoom(variableManager.CONFIG_PIXEL_PER_INTERVAL);
    });
    return (
        <div 
            style={{
                height: '50px',
                display: 'flex'
            }}>
            <div 
                className={"track-panel display"}
                style={{
                    height: `${WAVEFORM_CONTAINER_HEIGHT}px`,
                    background: 'grey',
                    position: 'fixed',
                    zIndex: 140
                }}>Audio Track
            </div>

            <div 
                style={{
                    width: '50vw',
                    display: 'flex'
                }}></div>  
            <div id="waveform" style={{zIndex: 1}}></div>
        </div>
    )
}