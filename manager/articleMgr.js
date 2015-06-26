/**
 * Created by dell on 2015/6/25.
 */
(function(){

    "use strict";

    var database = require('../conf/database');
    var Article = require('../models/article')(database.connection);

    //添加文章
    module.exports.add = function(params,callback){

        var article = new Article(params);

        article.save(function (err,result) {
            err ? callback(err, null) : callback(null, result);
        });

    };

    //获取指定文章
    module.exports.findOne = function(params,callback){

        Article.findOne(params).populate('plate_id').exec(function (err, result) {
            err ? callback(err, null) : callback(null, result);
        });
    };

    var _query = function(params){

        var query = Article.find({},{"content":0});

        if(params.isVisible){
            query.where('isVisible',params.isVisible);
        }

        if(params.plate_id){
            query.where('plate_id',params.plate_id);
        }

        if(params.title){
            var reg = new RegExp(params.title);
            query.find({"title":reg});
        }

        return query;
    };


    //根据条件获取文章列表并分页
    module.exports.select = function(params,callback){

        var perPage = params["per-page"],pageIndex = params["page"] - 1;

        var query = _query(params);

        query.limit(perPage).skip(perPage * pageIndex).sort({'update_time':-1});

        query.populate('plate_id','_id zh_name en_name').exec(function(err,result){
            err ? callback(err, null) : callback(null, result);
        })
    };

    //根据条件获取个数
    module.exports.count = function(params,callback){

        var query = _query(params).count();

        query.exec(function(err,result){
            err ? callback(err, null) : callback(null, result);
        })
    };

}).call(this);