const db = wx.cloud.database();
/**
 * 数据库类
 */
class DB {

    /**
     * @description 数据库添加，默认为menus集合
     * @param {Object} param 对象参数为 _callection集合名，data要添加的数据
     * @return {Promise} 返回成功与否
     */
    dbadd({
        _collection = 'menus',
        data = {}
    }) {
        return db.collection(_collection).add({
            data
        })
    }

    /**
     * @description 删除集合某项，默认为types集合
     * @param {Object}  param _collection为集合，_id为要删除的项的id
     * @return {Promise} 返回成功与否
     */
    dbRemove({
        _collection = 'types',
        _id
    }) {
        return db.collection(_collection).doc(_id).remove();
    }

    /**
     * @description 根据某个条件删除一项或多项
     * @param {Object} param  _collection 集合名, data 要删除的查找条件
     * @return {Promise} 返回成功与否
     */
    dbBatchDel({
        _collection,
        data
    }) {
        return wx.cloud.callFunction({
            name: 'batchDel',
            data: {
                _collection,
                data
            }
        })
    }

    /**
     * @description 更新某条数据，默认为types集合
     * @param {Object} param _collection 集合名,_id 该项id,data 要更改的数据
     * @return {Promise} 返回成功与否
     */
    dbUpdate({
        _collection = 'types',
        _id,
        data
    }) {
        return db.collection(_collection).doc(_id).update({
            data
        })
    }

    /**
     * @description 查询聚合
     * @param {Object} param  _collection 为集合名,data为返回数据不填为全表，where为查询条件，若为空返回整个集合
     * @return {Promise} 返回成功结果值
     */
    dbGet({
        _collection,
        where = null
    }) {
        if (!where) {
            return db.collection(_collection).get()
        } else {
            return db.collection(_collection).where(where).get()
        }
    }

    /**
     * @description 分页返回
     * @param {Object} param  _collection 为集合名,data为返回数据不填为全表,limit为返回条数，默认10条,page页数默认为0表示第一页,data为要排序的字段，order为排序方法'desc'或'asc'
     * @return {Promise} 返回获取来的数据集
     */
    dbGetLimit({
        _collection,
        page = 0,
        limit = 10,
        data = '',
        order
    }) {

        if (data === '') {
            return db.collection(_collection).skip(page * limit).limit(limit).get()
        } else {
            // console.log(1);
            return db.collection(_collection).orderBy(data, order).skip(page * limit).limit(limit).get()
        }
    }

    /**
     * @description 查询指定id数组中的值
     * @param {Object} param _collection 为集合名, arr为_id的数组
     * @return {Promise} 返回结果集
     */
    dbGetIn({
        _collection,
        arr
    }) {
        return db.collection(_collection).where({
            _id: db.command.in(arr)
        }).get()
    }
}

module.exports = DB;