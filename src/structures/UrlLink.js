'use strict';

/**
 * UrlLink information
 */
class UrlLink {
    /**
     * 
     * @param {string} url 
     * @param {?string} title 
     * @param {?string} description 
     * @param {?MessageMedia} thumbnailMedia 
     */

    constructor(url, title, description, thumbnailMedia) {
        this.url = url;

        this.title = title || '';

        this.description = description || '';

        this.thumbnailData = thumbnailMedia?.data || '';
    }
}

module.exports = UrlLink;