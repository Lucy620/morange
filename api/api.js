import config from '../utils/config';

var serverApiUrl = !config.SYSTEM.debug ? config.BASE.apiUrl : config.BASE.apiTestUrl

module.exports = {
  wxMpPay: config.BASE.wxPayUrl, // 微信支付
  cardPay: serverApiUrl + 'cardPaynotify', // 魔橙卡支付
  miniProgramLogin: serverApiUrl + "miniProgramLogin", // 静默登录
  miniProgramInitUser: serverApiUrl + "miniProgramInitUser", // 初始化用户
  updateWxSessionKey: serverApiUrl + "updateWxSessionKey", // 更新微信session_key
  updateAvatarAndNickname: serverApiUrl + "updateAvatarAndNickname", // 更新微信头像及昵称
  getQiNiuToken: "https://mp.morangefitness.com/getQiNiuToken", // 获取七牛token
  getUnreceivedCouponList: serverApiUrl +"getUnreceivedCouponList", //获取未领取优惠券
  getFreeCourseList: serverApiUrl + "getFreeCourseList", // 获取免费课程列表
  getStoreList: serverApiUrl + "getStoreList", // 获取门店列表
  getStoreDetail: serverApiUrl + "getStoreDetail", // 门店详情
  saveStoreFavorite: serverApiUrl + "saveStoreFavorite", // 收藏门店
  getStoreAreaList: serverApiUrl + "getStoreAreaList", // 获取门店区域列表
  getStoreThemeList: serverApiUrl + "getStoreThemeList", // 获取门店主题列表
  getCourseTargetList: serverApiUrl + "getCourseTargetList", // 获取科目目的列表
  getCourseCategoryList: serverApiUrl + "getCourseCategoryList", // 获取科目分类列表
  getCourseTeamCourseList: serverApiUrl + "getCourseTeamCourseList", // 获取团体课科目列表
  getCourseTeamList: serverApiUrl + "getCourseTeamList", // 获取团体课列表（单日）
  getCourseTeamListAll: serverApiUrl + "getCourseTeamListAll", // 获取团体课列表（全部）
  getCourseTeamDetail: serverApiUrl + "getCourseTeamDetail", // 获取团体课详情
  getCoursePrivateList: serverApiUrl + "getCoursePrivateList", // 获取私教列表
  getCoursePrivateListRecommend: serverApiUrl + "getCoursePrivateListRecommend", // 获取私教课列表(推荐)
  getCoursePrivateCourseList: serverApiUrl + "getCoursePrivateCourseList", // 获取私教课科目列表
  getCoursePrivateDetail: serverApiUrl + "getCoursePrivateDetail", // 获取私教课详情
  getCourseCampList: serverApiUrl + "getCourseCampList", // 获取训练营列表
  getCourseCampListRecommend: serverApiUrl + "getCourseCampListRecommend", // 获取训练营列表(推荐)
  getCourseCampDetail: serverApiUrl + "getCourseCampDetail", // 获取训练营详情
  getUserReserve: serverApiUrl + "getUserReserve", // 我的预约
  getUserReserveLog: serverApiUrl + "getUserReserveLog", // 预约记录
  getUserReserveDetail: serverApiUrl + "getUserReserveDetail", // 查看预约详情
  getMccardHome: serverApiUrl + "getMccardHome", // 魔橙卡首页
  getMedalList: serverApiUrl + "getMedalList", // 徽章列表
  getChargeList: serverApiUrl + "getChargeList", // 获取充值列表
  createChargeOrder: serverApiUrl + "createChargeOrder", // 创建充值记录
  getCoachHome: serverApiUrl + "getCoachHome", // 获取教练个人中心
  getCoachCourseList: serverApiUrl + "getCoachCourseList", // 获取教练排课列表
  getQrcodeSignDetail: serverApiUrl + "getQrcodeSignDetail", // 扫码签到界面
  tradeOrder: serverApiUrl + "tradeOrder", // 确认订单
  createOrder: serverApiUrl + "createOrder", // 创建订单
  refundOrder: serverApiUrl + "refundOrder", // 退款
  getGiveOrderDetail: serverApiUrl + "getGiveOrderDetail", // 获取赠送订单详情
  saveGiveOrderGiveUser: serverApiUrl + "saveGiveOrderGiveUser", // 获取赠送订领取赠送订单单详情
  coachReportMatterList: serverApiUrl + "coachReportMatterList", // 教练报备事项列表
  coachCreateReport: serverApiUrl + "coachCreateReport", // 教练新增报备
  coachReportList: serverApiUrl + "coachReportList", // 教练报备列表
  coachIncomeList: serverApiUrl + "coachIncomeList", // 教练收入明细
  getCoachIncomeDetail: serverApiUrl + "getCoachIncomeDetail", // 教练收入详情
  coachIntegralList: serverApiUrl + "coachIntegralList", // 教练积分明细列表
  coachUserCourseRankList: serverApiUrl + "coachUserCourseRankList", // 教练学员排名列表
  getCoachDetail: serverApiUrl + "getCoachDetail", // 获取教练详情
  userCouponList: serverApiUrl + "userCouponList", // 代金券列表
  invalidUserCouponList: serverApiUrl + "invalidUserCouponList", // 失效代金券列表
  checkCouponCode: serverApiUrl + "checkCouponCode", // 检验代金券兑换码
  receiveUserCoupon: serverApiUrl + "receiveUserCoupon", // 领取代金券
  getMedalDetail: serverApiUrl + "getMedalDetail", // 徽章详情
  giveOrderList: serverApiUrl + "giveOrderList", // 赠课列表
  userRefundOrderList: serverApiUrl + "userRefundOrderList", // 取消订单列表
  userRefundOrderDetail: serverApiUrl + "userRefundOrderDetail", // 取消订单详情
  molicUserCourseRankList: serverApiUrl + "molicUserCourseRankList", // 魔力橙用户排名
  receiveInviteNewCoupon: serverApiUrl + "receiveInviteNewCoupon", // 代金券邀请好友领取页面
  myInviteHome: serverApiUrl + "myInviteHome", // 邀请好友首页
  saveInviteNewCoupon: serverApiUrl + "saveInviteNewCoupon", // 领取邀请券
  uploadCoursePhoto: serverApiUrl + "uploadCoursePhoto", // 上传课程图片
  getSpellCoachSelectNew: serverApiUrl + "getSpellCoachSelectNew", // 获取拼课教练选项
  getSpellCourseSelectNew: serverApiUrl + "getSpellCourseSelectNew", // 获取拼课选项
  createSpellCourse: serverApiUrl + "createSpellCourse", // 申请拼课
  coachSpellCourse: serverApiUrl + "coachSpellCourse", // 教练拼课处理
  inviteSpellCourse: serverApiUrl + "inviteSpellCourse", // 邀请拼课
  scanQrcodeSign: serverApiUrl + "scanQrcodeSign", // 扫码确认签到
  reserveCourse: serverApiUrl + "reserveCourse", // 预约科目
  getCoachPrivateList: serverApiUrl + "getCoachPrivateList", // 获取教练私教课列表
  coachClassEnd: serverApiUrl + "coachClassEnd", // 教练结课
  getQrcodeSignPrivateDetail: serverApiUrl + "getQrcodeSignPrivateDetail", // 扫码签到界面
  getIntegralGradeList: serverApiUrl + "getIntegralGradeList", // 积分等级列表
  getUserIntegralLog: serverApiUrl + "getUserIntegralLog", // 积分列表

  getCourseCommentList: serverApiUrl + "getCourseCommentList", // 获取评价留言
  getCoachCourseCommentList: serverApiUrl + "getCoachCourseCommentList", // 获取教练评价留言
  createCourseComment: serverApiUrl + "createCourseComment", // 进行评价留言
  attentionCoach: serverApiUrl + "attentionCoach", // 关注/取消关注 教练
  
}