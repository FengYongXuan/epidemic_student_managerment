const sd = require('silly-datetime')

module.exports = class leaveForm_dao extends require('../model/leaveForm_mod') {

  // 学生根据id获取假条
  static async getLeaveFormList(req,res) {
    let query = req.query.query
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    const id = req.params.id
    await this.getLFListById(id, query).then(result => {
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      let data = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0; i<data.length; i++) {
        data[i]['start_time'] = sd.format(data[i]['start_time'], 'YYYY-MM-DD')
        data[i]['end_time'] = sd.format(data[i]['end_time'], 'YYYY-MM-DD')
        data[i]['createdTime'] = sd.format(data[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
        // 将state转成具体的信息
        const state_reflect = { '0': '未审批', '1': '审批未通过', '2': '审批通过'}
        data[i].state = state_reflect[data[i].state]
      }
      res.status(200).json({
        data: data,
        total: total
      })
    }).catch(err => {
      res.status(404).end()
    })
  }

  // 新建假条
  static async addLeaveForm(req,res) {
    let body = req.body
    let id = req.params.id
    let createdTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    await this.addLF(id,body,createdTime)
        .then(() => {
          res.status(201).end()
        }).catch(() => {
          res.status(403).end()
        })
  }

  // 根据假条的序号sn获取假条信息
  static async getLeaveForm(req,res) {
    let sn = Number(req.params.sn)
    await this.getLFBySn(sn).then(result => {
      // 将state转成具体的信息
      const state_reflect = { '0': '未审批', '1': '审批未通过', '2': '审批通过'}
      result[0].state = state_reflect[result[0].state]
      result[0]['start_time'] = sd.format(result[0]['start_time'], 'YYYY-MM-DD')
      result[0]['end_time'] = sd.format(result[0]['end_time'], 'YYYY-MM-DD')
      result[0]['createdTime'] = sd.format(result[0]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      let data = JSON.parse(JSON.stringify(result[0]))
      res.status(200).json({data})
    }).catch(() => {
      res.status(404).end()
    })
  }

  // 根据假条的序号sn更新假条
  static async updateLeaveForm(req,res) {
    let sn = Number(req.params.sn)
    let body = req.body
    await this.updateLFBySn(sn,body).then(result => {
      res.status(201).end()
    }).catch(err => {
      res.status(403).end()
    })
  }

  // 根据假条的序号sn删除假条
  static async deleteLeaveForm(req,res) {
    let sn = Number(req.params.sn)
    await this.deleteLFBySn(sn).then(result => {
      res.status(204).end()
    }).catch(err => {
      res.status(403).end()
    })
  }

  // 根据辅导员id和假条的state获取假条
  static async getDiffLeaveForm(req,res) {
    let id = req.params.id
    let state = req.params.state
    let query = req.query.query
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    await this.getDiffLF(id, state, query).then((result) => {
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      let data = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0;i<data.length; i++) {
        data[i]['start_time'] = sd.format(data[i]['start_time'], 'YYYY-MM-DD')
        data[i]['end_time'] = sd.format(data[i]['end_time'], 'YYYY-MM-DD')
        data[i]['createdTime'] = sd.format(data[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      }
      res.status(200).json({
        data: data,
        total: total
      })
    }).catch(err =>{
      res.status(403).end()
    })
  }

  // 更新假条的state
  static async updateLeaveFormState(req,res) {
    let sn = Number(req.params.sn)
    let isOK = req.params.isOK
    let state = '0'
    if (isOK === 'true') {
      state = '2'
    } else {
      state = '1'
    }
    await this.updateLFState(sn, state).then(result => {
      res.status(200).end()
    }).catch(err =>{
      res.status(403).end()
    })
  }
}