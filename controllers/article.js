/**
 * Created by King on 2015/6/25.
 * Article Controllers
 */
(function(){

    "use strict";

    var Render = require("../util/render");
    var _ = require('underscore');

    var _ArticleService = require('../services/article');
    var Promise = require("bluebird");
    var ArticleService = Promise.promisifyAll(_ArticleService);


    /**
     * Add article
     * @see models.article
     */
    module.exports.create = function(request, response){

        var paras = request.body;

        if(!paras["title"] || !paras["content"] || !paras["cover_url"] || !paras["plate_id"]){

            Render.missParas("缺少参数").send(response);
            return false;

        }

        ArticleService.createAsync(paras).then(function(doc){

            var result = doc.toObject();
            Render.success("添加成功",result).send(response);

        }).catch(function(e){

            Render.exception(e).send(response);

        });

    };

    /**
     * remove article
     * @param { Number }   request.params._id
     */
    module.exports.remove = function(request, response){

        var params = request.params;

        if(!params["_id"]){

            Render.missParas("缺少ID").send(response);
            return false;

        }

        ArticleService.removeAsync(params).then(function(){

            Render.success("删除成功",{}).send(response);

        }).catch(function(e){

            Render.exception(e).send(response);

        });


    };

    /**
     * update article
     * @see models.article
     */
    module.exports.update = function(request, response){

        var paras = request.body;

        if(!paras["_id"]){

            Render.missParas("缺少id").send(response);
            return false;

        }

        var condition = {_id:paras._id};
        var model = paras;
        var options = {new:true};

        ArticleService.updateAsync(condition,model,options).then(function(data){

            Render.success("修改成功",data).send(response);

        }).catch(function(e){

            Render.exception(e).send(response);

        });

    };

    /**
     * Find article by id
     * @param { Number }  request.params._id
     */
    module.exports.findOne = function(request, response){

        var paras = request.params;

        if(!paras["_id"] ){

            Render.missParas("缺少文章ID").send(response);
            return false;

        }

        ArticleService.findOneHavePlateAsync(paras).then(function(doc){

            if(doc){

                var result = doc.toObject();
                Render.success("查询成功",result).send(response);

            }
            else{

                Render.notFound("文章不存在").send(response);

            }

        }).catch(function(e){

            Render.exception(e).send(response);

        });

    };

    /**
     * Get article and count by condition
     * @param { Boolean }  request.query.isVisible
     * @param { Number }   request.query.plate_id
     * @param { String }   request.query.title
     * @param { Number }   request.query.per-page
     * @param { Number }   request.query.page
     */
    module.exports.query = function(request, response){

        var paras = request.query;

        var total = 0;

        // Set default pagination options
        var default_options = {
            "per-page":10,
            "page":1
        };

        var omitKeys = ["title"];

        paras = _.extend(default_options,paras);

        ArticleService.countAsync(paras,omitKeys).then(function(count){

            total = count;

        }).then(function(){

            return ArticleService.selectAsync(paras,{'update_time':-1},omitKeys);

        }).then(function(data){

            Render.data(data,total).send(response);

        }).catch(function(e){

            Render.exception(e).send(response);

        });

    }


}).call(this);