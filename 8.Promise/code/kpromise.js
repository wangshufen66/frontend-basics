export default class KPromise {
    constructor(handle) {
        this['[[PromiseState]]'] = "pending"
        this['[[PromiseResult]]'] = undefined;
        // this.resolveFn = undefined;
        // this.rejectFn = undefined;
        this.resolveQueue = [];
        this.rejectQueue = [];

        handle(this.#resolve.bind(this), this.#reject.bind(this));
    }
    #resolve(val) {
        this['[[PromiseState]]'] = 'fulfilled';
        this['[[PromiseResult]]'] = val;
        // this.resolveFn(val);
        const run = () => {
            let cb;
            // [fn1,fn2....]
            while (cb = this.resolveQueue.shift()) {
                cb && cb(val);
            }
        }
        // run();
        // setTimeout(run);
        const observer = new MutationObserver(run);
        observer.observe(document.body, {
            attributes: true
        });
        document.body.setAttribute("kkb", "value");
    }
    #reject(err) {
        this['[[PromiseState]]'] = 'rejected';
        this['[[PromiseResult]]'] = err;
        this.rejectFn && this.rejectFn(err);
        const run = () => {
            let cb;
            // [fn1,fn2....]
            while (cb = this.rejectQueue.shift()) {
                cb && cb(err);
            }
        }
        // run();
        // setTimeout(run);
        const observer = new MutationObserver(run);
        observer.observe(document.body, {
            attributes: true
        });
        document.body.setAttribute("kkb", "value");
    }

    then(onResolved, onRejected) {
        // this.resolveFn = onResolved;
        // this.rejectFn = onRejected;
        return new KPromise((resolve, reject) => {
            // let val = onResolved && onResolved();
            let resolveFn = function (val) {
                let reslut = onResolved && onResolved(val);
                // 返还的KPromise对象
                if (reslut instanceof KPromise) {
                    // reslut.then(res=>{
                    //     resolve(res);
                    // })
                    reslut.then(resolve);
                } else {
                    resolve(reslut);
                }
            }
            this.resolveQueue.push(resolveFn);

            let rejectFn = function (err) {
                onRejected && onRejected(err);
                reject(err);
            }
            this.rejectQueue.push(rejectFn);
        })


        // this.resolveQueue.push(onResolved);
        // this.rejectQueue.push(onRejected);

        // if(this['[[PromiseState]]'] === 'fulfilled'){
        //     onResolved && onResolved(this['[[PromiseResult]]']);
        // }else{
        //     onRejected && onRejected(this['[[PromiseResult]]']);
        // }
    }
    catch(fn) {
        return this.then(undefined, fn);
    }
    static resolve(val) {
        return new KPromise(resolve => {
            resolve(val);
        })
    }
    static reject(err) {
        return new KPromise((resolve, reject) => {
            reject(err);
        })
    }
    static race(lists) {
        let isExe = false;
        return new KPromise((resolve, reject) => {
            lists.forEach(item => {
                item.then(res => {
                    if (!isExe) {
                        resolve(res);
                        isExe = true;
                    }
                }, err => {
                    if (!isExe) {
                        reject(err);
                        isExe = true;
                    }

                })
            })
        })
    }
    static allSettled(lists){
        // let resArr = [1,2];
        let resArr = new Array(lists.length);
        let num = 0;
        return new KPromise(reslove=>{
            lists.forEach((item,key)=>{
                let obj = {};
                item.then(res=>{
                    obj['status'] = "fulfilled";
                    obj['value'] = res;
                    resArr[key] = obj;
                    // console.log(1,resArr);
                    num++;
                    if(num>=lists.length){
                        reslove(resArr);
                    }
                },err=>{
                    obj['status'] ="rejected";
                    obj['reson'] = err;
                    resArr[key] = obj;
                    num++;
                    // console.log(2,resArr);
                    if(num>=lists.length){
                        reslove(resArr);
                    }
                })
            })
            
        })
    }
}