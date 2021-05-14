module.exports = {
    user: [
        {"code":20000,"data":{"token":"admin-token"}},
        {"code":20000,"data":{"token":"editor-token"}},
    ],
    userInfo: {
        "admin-token": {
            "code": 20000,
            "data": {
                "roles": ["admin"],
                "introduction": "I am a super administrator",
                "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                "name": "Super Admin"
            }
        },
        "editor-token": {
            "code": 20000,
            "data": {
                "roles": ["editor"],
                "introduction": "I am an editor",
                "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                "name": "Normal Editor"
            }
        },
    },
    userList: {
        "code": 20000,
        "data": [
            {
                date: '2021-05-01',
                username: '王小虎1',
                password: '123456'
            },
        ]
    },
    positionList: [
        {   
            id: 2,
            companyLogo: 'byteDance2.jpg',
            companyLogoUrl: 'http://localhost:3000/upload/byteDance2.jpg',
            companyName: '公司1',  
            positionName: '前端开发',
            city: '上海',  
            salary: '3000',
            createTime: '2020-05-01'
        },
        {   
            id: 1,
            companyLogo: 'byteDance1.jpg',
            companyLogoUrl: 'http://localhost:3000/upload/byteDance1.jpg',
            companyName: '公司2',  
            positionName: '后端开发',
            city: '上海',  
            salary: '3000',
            createTime: '2020-05-01'
        },
        
    ]
}
