class Xhr {
    static baseUrl = '';
    constructor(endpoint, options = {}) {
        this.body = options.body ? JSON.stringify(options.body) : null;
        this.xhr = new XMLHttpRequest();
        this.xhr.open(options.method ? options.method.toUpperCase() : 'GET', options.useBaseUrl ? options.useBaseUrl + endpoint : Xhr.baseUrl + endpoint);
        this.xhr.send(this.body)
        this.result = this.result.bind(this);
        this.abort = this.abort.bind(this);
    }
    abort() {
        if (this.xhr.readyState < 4 && this.xhr.readyState > 0) {
            this.xhr.abort();
        }
    }
    result() {
        return new Promise((resolve, reject) => {
            this.xhr.onload = () => {
                if (this.xhr.status >= 200 && this.xhr.status <= 300) {
                    resolve(JSON.parse(this.xhr.response))
                } else {
                    reject(JSON.parse(this.xhr.response))
                }
            }
            this.xhr.onerror = () => {
                reject(JSON.parse(this.xhr.response))
            }
        })
    }
}
export default Xhr;