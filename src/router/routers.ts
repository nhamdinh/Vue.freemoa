import AboutViewVue from '@/views/AboutView.vue'
import HomeViewVue from '@/views/HomeView.vue'
import FindIdViewVue from '@/views/FindIdView.vue'
import FindPassViewVue from '@/views/FindPassView.vue'
import TempAccountViewVue from '@/views/TempAccountView.vue'
import RegisterViewVue from '@/views/RegisterView.vue'
import InquiryCreateViewVue from '@/views/InquiryCreateView.vue'
import PostCreateViewVue from '@/views/PostCreateView.vue'
import PostUpdateViewVue from '@/views/PostUpdateView.vue'
import LoginViewVue from '@/views/LoginView.vue'
import TodoViewVue from '@/views/TodoView.vue'
import BestProductListViewVue from '@/views/BestProductListView.vue'
import MarketListViewVue from '@/views/MarketListView.vue'
import MyInterestsListViewVue from '@/views/MyInterestsListView.vue'
import BoardListViewVue from '@/views/BoardListView.vue'
import OraServicesListViewVue from '@/views/OraServicesListView.vue'

import CompanyListViewVue from '@/views/CompanyListView.vue'
import CompanyDetailViewVue from '@/views/CompanyDetailView.vue'
import RoomChatListViewVue from '@/views/RoomChatListView.vue'
import RoomChatDetailViewVue from '@/views/RoomChatDetailView.vue'
import RoomChatCreateViewVue from '@/views/RoomChatCreateView.vue'
import FinanceListViewVue from '@/views/OraFinanceListView.vue.vue'
import GovernmentListViewVue from '@/views/OraGovernmentListView.vue'
import OrganizationDetailViewVue from '@/views/OrganizationDetailView.vue'

import MyInfoViewVue from '@/views/MyInfoView.vue'
import SettingViewVue from '@/views/SettingView.vue'
import IntroBizzViewVue from '@/views/IntroBizzView.vue'
import ShareAppViewVue from '@/views/ShareAppView.vue'

import MyWritingViewListVue from '@/views/MyWritingViewList.vue'
import MyWritingDetailViewVue from '@/views/MyWritingDetailView.vue'
import NoticesEventsListViewVue from '@/views/NoticesEventsListView.vue'
import NoticesEventsDetailViewVue from '@/views/NoticesEventsDetailView.vue'
import WhatNewListViewVue from '@/views/WhatNewListView.vue'
import WhatNewDetailViewVue from '@/views/WhatNewDetailView.vue'
import OrganizationPostsListViewVue from '@/views/OrganizationPostsListView.vue'
import OrganizationPostsDetailViewVue from '@/views/OrganizationPostsDetailView.vue'
import BestCommunityPostListViewVue from '@/views/BestCommunityPostListView.vue'
import BestCommunityPostDetailViewVue from '@/views/BestCommunityPostDetailView.vue'
import ProductReviewListViewVue from '@/views/ProductReviewListView.vue'
import ProductReviewDetailViewVue from '@/views/ProductReviewDetailView.vue'
import InquiryListViewVue from '@/views/InquiryListView.vue'
import InquiryDetailViewVue from '@/views/InquiryDetailView.vue'

import ProductDetailViewVue from '@/views/ProductDetailView.vue'
import ServiceDetailOrganizationViewVue from '@/views/ServiceDetailOrganizationView.vue'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeViewVue
  },
  {
    path: '/login',
    name: 'login',
    component: LoginViewVue
  },
  {
    path: '/find-id',
    name: 'findid',
    component: FindIdViewVue
  },
  {
    path: '/find-password',
    name: 'findpassword',
    component: FindPassViewVue
  },
  {
    path: '/temp-account',
    name: 'TempAccount',
    component: TempAccountViewVue
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterViewVue
  },
  {
    path: '/inquiry-create',
    name: 'InquiryCreate',
    component: InquiryCreateViewVue
  },
  {
    path: '/post-create',
    name: 'PostCreate',
    component: PostCreateViewVue
  },
  {
    path: '/post-update',
    name: 'PostUpdate',
    component: PostUpdateViewVue
  },
  {
    path: '/best-product-list',
    name: 'BestProductList',
    component: BestProductListViewVue
  },
  {
    path: '/market-list',
    name: 'MarketList',
    component: MarketListViewVue
  },
  {
    path: '/my-interests-list',
    name: 'MyInterestsList',
    component: MyInterestsListViewVue
  },
  {
    path: '/board-list',
    name: 'BoardList',
    component: BoardListViewVue
  },
  {
    path: '/organization-service-list',
    name: 'OraServicesList',
    component: OraServicesListViewVue
  },
  {
    path: '/product-detail',
    name: 'ProductDetail',
    component: ProductDetailViewVue
  },
  {
    path: '/service-detail-organization',
    name: 'ServiceDetailOrganization',
    component: ServiceDetailOrganizationViewVue
  },
  {
    path: '/my-info',
    name: 'MyInfo',
    component: MyInfoViewVue
  },
  {
    path: '/setting',
    name: 'Setting',
    component: SettingViewVue
  },
  {
    path: '/introduce',
    name: 'IntroBizz',
    component: IntroBizzViewVue
  },
  {
    path: '/share-app',
    name: 'ShareApp',
    component: ShareAppViewVue
  },
  {
    path: '/my-writing-list',
    name: 'MyWritingViewList',
    component: MyWritingViewListVue
  },
  {
    path: '/my-writing-detail',
    name: 'MyWritingDetail',
    component: MyWritingDetailViewVue
  },
  {
    path: '/notices-events-list',
    name: 'NoticesEventsList',
    component: NoticesEventsListViewVue
  },
  {
    path: '/notices-events-detail',
    name: 'NoticesEventsDetail',
    component: NoticesEventsDetailViewVue
  },
  {
    path: '/what-new-list',
    name: 'WhatNewList',
    component: WhatNewListViewVue
  },
  {
    path: '/what-new-detail',
    name: 'WhatNewDetail',
    component: WhatNewDetailViewVue
  },
  {
    path: '/organization-posts-list',
    name: 'OrganizationPostsList',
    component: OrganizationPostsListViewVue
  },
  {
    path: '/organization-posts-detail',
    name: 'OrganizationPostsDetail',
    component: OrganizationPostsDetailViewVue
  },
  {
    path: '/best-community-post-list',
    name: 'BestCommunityPostList',
    component: BestCommunityPostListViewVue
  },
  {
    path: '/best-community-post-detail',
    name: 'BestCommunityPostDetail',
    component: BestCommunityPostDetailViewVue
  },

  {
    path: '/product-review-list',
    name: 'ProductReviewList',
    component: ProductReviewListViewVue
  },
  {
    path: '/product-review-detail',
    name: 'ProductReviewDetail',
    component: ProductReviewDetailViewVue
  },

  {
    path: '/inquiry-list',
    name: 'InquiryList',
    component: InquiryListViewVue
  },
  {
    path: '/inquiry-detail',
    name: 'InquiryDetail',
    component: InquiryDetailViewVue
  },
  {
    path: '/company-list',
    name: 'CompanyList',
    component: CompanyListViewVue
  },
  {
    path: '/room-chat-list',
    name: 'RoomChatList',
    component: RoomChatListViewVue
  },
  {
    path: '/company-detail',
    name: 'CompanyDetail',
    component: CompanyDetailViewVue
  },
  {
    path: '/room-chat-detail',
    name: 'RoomChatDetail',
    component: RoomChatDetailViewVue
  },
  {
    path: '/room-chat-create',
    name: 'RoomChatCreate',
    component: RoomChatCreateViewVue
  },
  {
    path: '/finance-list',
    name: 'FinanceList',
    component: FinanceListViewVue
  },
  {
    path: '/government-list',
    name: 'GovernmentList',
    component: GovernmentListViewVue
  },
  {
    path: '/organization-detail',
    name: 'OrganizationDetail',
    component: OrganizationDetailViewVue
  },

  {
    path: '/about',
    name: 'about',
    component: AboutViewVue
  },
  {
    path: '/todo',
    name: 'todo',
    component: TodoViewVue
  }
]

export default routes
