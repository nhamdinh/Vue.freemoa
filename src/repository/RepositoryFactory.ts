import TodoRepository from './TodoRepository'
import AuthRepository from './auth/AuthRepository'
import CompanyRepository from './company/CompanyRepository'
import RoomChatRepository from './roomChat/RoomChatRepository'
import ArticleRepository from './article/ArticleRepository'
import InquiryRepository from './inquiry/InquiryRepository'
import ProductRepository from './product/ProductRepository'

const repositories: any = {
  tasks: TodoRepository,
  auth: AuthRepository,
  company: CompanyRepository,
  chatRoom: RoomChatRepository,
  article: ArticleRepository,
  inquiry: InquiryRepository,
  product: ProductRepository,
}

export const RepositoryFactory = {
  get: (name: any) => repositories[name]
}
