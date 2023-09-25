class YoutubeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
        };
        this.toggleBox = this.toggleBox.bind(this);
    }

    toggleBox() {
        let { opened } = this.state;
        this.setState({
            opened: !opened,
        });
    }

    getRequest(searchTerm) {
        var url = 'https://www.googleapis.com/youtube/v3/search';
        var params = {
            part: 'snippet',
            key: 'XXXXXX',
            q: searchTerm
        };

        $.getJSON(url, params, this.showResults);
    }

    showResults(results) {
        var html = "";
        var entries = results.items;

        $.each(entries, function (index, value) {
            var title = value.snippet.title;
            var thumbnail = value.snippet.thumbnails.default.url;
            html += '<p>' + title + '</p>';
            html += '<img src="' + thumbnail + '">';
        });

        $('.youtube-search-bar').html(html);
    }

    render() {
        let { opened } = this.state;
        return <div style={{ height: 'inherit' }}>
            <button
                style={
                    {
                        padding: "1px " + FONT_SIZE + "px",
                        fontSize: FONT_SIZE + "px",
                        marginLeft: 2 * GAP_WIDTH + "px",
                        height: divToolBarHeight + 'px',
                        width: divToolBarHeight + 'px',
                        background: `url('static/assets/ytb-icon.png') no-repeat`,
                        backgroundSize: '22px',
                        backgroundColor: 'white'
                    }
                }
                className='btn'
                onClick={this.toggleBox}>
            </button>
            <div
                style={
                    {
                        position: 'absolute',
                        zIndex: 100,
                        background: COLOR_BACKGROUND,
                        display: opened ? "flex" : "none",
                        top: divToolBarHeight + GAP_WIDTH + "px",
                        color: 'white',
                        width: '180px',
                        right: '0px'
                    }
                }
                className='youtube-list'>
                <input
                    style={
                        {
                            height: INPUT_BAR_HEIGHT + "px",
                            width: 'inherit',
                            color: 'black'
                        }}
                    type={'text'}
                    className={'youtube-search-bar'}>
                </input>
                <div style={{
                    width: INPUT_BAR_HEIGHT + 'px',
                    height: INPUT_BAR_HEIGHT + 'px',
                    background: 'white'
                }} onClick={
                    () => {
                        var searchTerm = $('.youtube-search-bar').val();
                        if (searchTerm.substring(0, 32) === 'https://www.youtube.com/watch?v='
                            ||
                            searchTerm.substring(0, 25) === 'www.youtube.com/watch?v='
                        ) {
                            console.log(searchTerm)
                        }
                    }
                }></div>
            </div>
        </div>
    }
}
