const sd = require('silly-datetime')

module.exports = class temForm_dao extends require('../model/temForm_mod') {

  // 根据学生id获取体温表列表
  static async getTemFormList(req,res) {
    let index = req.query.query
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    const id = req.params.id
    await this.getTemFormListById(id, index).then(result => {
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      let data = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0; i<data.length; i++) {
        data[i]['createdTime'] = sd.format(data[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      }
      res.status(200).json({
        data: data,
        total: total
      })
    }).catch(err => {
      res.status(404).end()
    })
  }

  // 新建一张体温表
  static async addTemForm(req,res) {
    let body = req.body
    let id = req.params.id
    let createdTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    await this.createTemForm(id,body.temperature,body.fever,body.counselor_name,createdTime).then(result => {
      res.status(201).end()
    }).catch(err => {
      res.status(403).end()
    })
  }

  // 根据体温表的序号sn获取体温表信息
  static async getTemForm(req,res) {
    let sn= Number(req.params.sn)
    await this.getTemFormBySn(sn).then(result => {
      result[0]['createdTime'] = sd.format(result[0]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      let data = JSON.parse(JSON.stringify(result[0]))
      res.status(200).json({data})
    }).catch(err => {
      res.status(404).end()
    })
  }

  // 根据体温表的序号sn更新体温表
  static async updateTemForm(req,res) {
    let sn = Number(req.params.sn)
    let body = req.body
    await this.updateTemFormBySn(sn,body).then(result => {
      res.status(201).end()
    }).catch(err => {
      res.status(403).end()
    })
  }

  // 根据体温表的序号sn删除体温表
  static async deleteTemForm(req,res) {
    let sn = Number(req.params.sn)
    await this.deleteTemFormBySn(sn).then(result => {
      res.status(204).end()
    }).catch(err => {
      res.status(403).end()
    })
  }

  // 根据辅导员id获取体温表列表
  static async getTFListCoun(req,res) {
    let index = req.query.query
    let select = req.query.select
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    const id = req.params.id
    await this.getTFListCounById(id, index, select).then(result => {
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      let data = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0;i<data.length; i++) {
        data[i]['createdTime'] = sd.format(data[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      }
      res.status(200).json({
        data: data,
        total: total
      })
    }).catch(err => {
      res.status(404).send()
    })
  }
}