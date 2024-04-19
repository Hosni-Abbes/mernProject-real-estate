const StaticData = {
    baseServerUrl: 'http://127.0.0.1:5000',
    aboutUs: {
        intro: "When it's about Real estates and buildings, here it comes our job!",
        homeIntro: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
        history:'Founded in 2000, X is a website where you can buy/sell buildings, houses.. Our main objective is to make it easy for you to discover news about real estate.',
        address: 'Tunisia, 3080 Safx',
        phone: '+216 21 217 279',
        email: 'hosny.abbes@gmail.com',
        linkedinUrl:'https://www.linkedin.com',
        twitterUrl: 'https://www.twitter.com',
        facebookUrl: 'https://www.facebook.com',
        img: '/uploads/about.jpg',
        onlineProjects: 164,
        connectedUsers: 1254,
        investments: 1256
    },
    homePageSliderImages: [
        {
            id: 1,
            path:'/uploads/slide1.webp',
            descLine1: 'This is a description.',
            descLine2: 'This is a description line 2.'
        },
        {
            id: 2,
            path:'/uploads/slide2.webp',
            descLine1: 'This is a description.',
            descLine2: 'This is a description line 2.'
        },
    ],
    latestYears: [
        {id:1, value:'2024'},
        {id:2, value:'2023'},
        {id:3, value:'2022'},
        {id:4, value:'2021'},
        {id:5, value:'2020'},
        {id:6, value:'2019'}
    ],
    news: [
        {
            id:1,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing "
        },
        {
            id:2,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the  printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s  printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:3,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:4,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:5,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:6,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:7,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:8,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:9,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:10,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:11,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:12,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            id:13,
            title: 'title1',
            content: "lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
    ],
    createProduct: {
        AllowedCountries: [ 
            {id:1, country: 'Tunisia'},
            {id:2, country: 'Algeria'},
            {id:3, country: 'Libya'},
            {id:4, country: 'Morroco'},
            {id:5, country: 'Egypt'},
        ]
    },
    pagination: {
        dashboardListLimit: 10,
        pageListLimit: 4,
    }
}


export default StaticData