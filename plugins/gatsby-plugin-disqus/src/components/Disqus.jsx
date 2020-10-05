import React from 'react'
import PropTypes from 'prop-types'
import { insertScript, removeScript, shallowComparison } from '../utils'


export default class Disqus extends React.Component {

    constructor(props) {
        super(props)
        this.shortname = (GATSBY_DISQUS_SHORTNAME && GATSBY_DISQUS_SHORTNAME.length) ? GATSBY_DISQUS_SHORTNAME : ''
        this.embedUrl = (GATSBY_DISQUS_EMBED_URL && GATSBY_DISQUS_EMBED_URL.length) ? GATSBY_DISQUS_EMBED_URL : `https://${this.shortname}.disqus.com/embed.js`

        if (props.config) {
            this.config = props.config
        } else {
            this.config = {
                identifier: props.identifier,
                url: props.url,
                title: props.title,
            }
        }
    }

    componentDidMount() {
        if (typeof window !== 'undefined' && window.document && this.shortname) {
            this.cleanInstance()
        }
        this.loadInstance()
    }

    shouldComponentUpdate(nextProps) {
        if (this.props === nextProps) {
            return false
        }
        return shallowComparison(this.props, nextProps)
    }

    componentDidUpdate() {
        this.loadInstance()
    }


    loadInstance() {
        if (typeof window !== 'undefined' && window.document && this.shortname) {
            const config = this.config
            window.disqus_config = function() {
                this.page.identifier = config.identifier
                this.page.title = config.title
                this.page.url = config.url
            }
            if (!window.document.getElementById('disqus-embed-script'))
                insertScript(this.embedUrl, 'disqus-embed-script', window.document.body)
        }
    }

    cleanInstance() {
        removeScript('disqus-embed-script', window.document.body)
        if (window && window.DISQUS) {
            window.DISQUS.reset()
        }
        try {
            delete window.DISQUS
        } catch (error) {
            window.DISQUS = undefined
        }
        const thread = window.document.getElementById('disqus_thread')
        if (thread) {
            while (thread.hasChildNodes()) {
                thread.removeChild(thread.firstChild)
            }
        }
    }

    render() {
        const { config, ...props } = this.props
        return (
            <div id='disqus_thread' {...props} />
        )
    }
}

Disqus.propTypes = {
    config: PropTypes.shape({
        /*
         * Tells the Disqus service how to identify the current page.
         * When the Disqus embed is loaded, the identifier is used to look up
         * the correct thread.
         */
        identifier: PropTypes.string,
        /*
         * Tells the Disqus service the title of the current page.
         * This is used when creating the thread on Disqus.
         */
        title: PropTypes.string,
        /*
         * Tells the Disqus service the URL of the current page.
         * This URL is used when a thread is created so that Disqus knows which
         * page a thread belongs to.
         * (If undefined, Disqus will use the global.location.href)
         */
        url: PropTypes.string,
    }),
    identifier: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
}
