'use strict';

/**
 * ProductMessage information
 */
class ProductMessage {
    /**
     * 
     * @param {string} businessOwnerJid 
     * @param {string} productId
     * @param {?string} title 
     * @param {?string} description 
     * @param {?MessageMedia} thumbnailMedia 
     */

    constructor(businessOwnerJid, productId, title, description, thumbnailMedia) {
        this.businessOwnerJid = businessOwnerJid;

        this.productId = productId;

        this.title = title || '';

        this.description = description || '';

        this.thumbnailMedia = thumbnailMedia;
    }
}

module.exports = ProductMessage;