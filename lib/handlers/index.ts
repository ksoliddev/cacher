export default {
    NAMES : ['express'],
    handle : (name : string) => require('./handlers/' + name + '_handler')
}