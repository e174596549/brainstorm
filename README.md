# 头脑风暴

## 0. 部署

## 1\. API

### 1.1 题目相关

#### 1.1.1 出题

**path:**

/i/question/add

**method:**

POST

**请求参数**

- uuid  {String} {必填} 出题人唯一 Id
- questionName {String} {必填} 题目名称 //'人口之最'
- describe {String} {必填} 题目描述 // '世界上人口最多的国家是'
- answers {String} {必填} 用 `,` 拼接各选项描述 // '中国,美国,德国,日本'
- rightAnswer {Number} {必填} 0 1 2 3
- level {Number} {必填} 1 2 3 ...
- type {Number} {必填} 1 历史 2 地理 3 社科 

**请求响应**

```javascript
    {
        code    :   {Number},//     0=成功
        msg     :   {String}, // code的描述信息
        data: {
            questionId :  {String}, // 题目唯一 ID
            powerCount:{Number}, // 可答题次数
        }
    }
```

#### 1.1.2 获取题目

**path:**

/i/question/get

**method:**

GET

**请求参数**

- questionId {String} {可选} 不选随机出题
- level {Number} {必须} 1 2 3 ...
- type {Number} {必须} 1 历史 2 地理 3 社科 

**请求响应**

```javascript
    {
        code    :   {Number},//     0=成功
        msg     :   {String}, // code的描述信息
        data: {
            questionId :  {String}, // 题目唯一 ID
            questionName : {String} // 题目名称
            describe : {String} // 题目描述
            answers : [{String}]
        }
    }
```

#### 1.1.3 答题

**path:**

/i/question/submit

**method:**

POST

**请求参数**

- uuid {String} {必填} 用户唯一 id
- questionId {String} {必填} 题目唯一 ID
- answers {Number} {必填} 0 1 2 3

**请求响应**

```javascript
    {
        code    :   {Number},//     0=成功
        msg     :   {String}, // code的描述信息
        data: {
            isRight :  {Boolean},
            rightAnswer: {String},
            powerCount:{Number}, // 可答题次数
        }
    }
```

### 1.2 用户相关

#### 1.2.0 更新用户信息

**path:**

/i/user/update-info

**method:**

POST

**请求参数**

- uuid {String} {必填} 用户唯一 id
- avatarUrl {String} {必填} 用户头像地址
- nickName {String}  {必填} 用户昵称

**请求响应**

```javascript
    {
        code    :   {Number},//     0=成功
        msg     :   {String}, // code的描述信息
        data    : {
            score:{Number},
            rank:{Number},
            submitTimes:{Number}, // 答题次数
            rightTimes:{Number}, // 正确次数
            wrongTimes:{Number}, // 正确次数
            powerCount:{Number}, // 可答题次数
        }
    }
```

#### 1.2.1 获取排行榜

**path:**

/i/rank/get

**method:**

GET

**请求参数**

- uuid {String} {必填} 用户唯一 ID
- page_num {Number} {可选 默认返回第一页} 页数
- page_size {Number} {可选 默认每页显示 10 个} 每页显示数量

**请求响应**

```javascript
    {
        code    :   {Number},//     0=成功
        msg     :   {String}, // code的描述信息
        data:{   
            page:{
                page_num: {Number} 当前页码数
                page_size: {Number} 每页显示数量
                record_total: {Number} 查询结果总数
                page_total: {Number} 总页码数
                list: [{
                    score:{Number},
                    avatarUrl {String},
                    nickName {String},
                    uuid:{String}，
                    rank:{Number}
                }]
            }
        }
    }
```

#### 1.2.2 获取用户信息详情

**path:**

/i/user/info

**method:**

GET

**请求参数**

- uuid {String} {必填}

**请求响应**

```javascript
    {
        code    :   {Number},//     0=成功
        msg     :   {String}, // code的描述信息
        data: {
            score:{Number},
            rank:{Number},
            submitTimes:{Number}, // 答题次数
            rightTimes:{Number}, // 正确次数
            wrongTimes:{Number}, // 正确次数
            powerCount:{Number}, // 可答题次数
        }
    }
```

## 2\. 签名算法

## 3\. 部署说明
