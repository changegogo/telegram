    /**
     * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
     * Created on 2017-07-31
     */
    const SMSClient = require('@alicloud/sms-sdk')
    // ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
    const accessKeyId = 'yourAccessKeyId'
    const secretAccessKey = 'yourAccessKeySecret'
    //初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: '1500000000',
        SignName: '云通信产品',
        TemplateCode: 'SMS_000000',
        TemplateParam: '{"code":"12345"}'
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
        }
    }, function (err) {
        console.log(err)
    })