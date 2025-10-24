import Cors from 'cors'
import initMiddleware from './init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: true
  })
)

export default cors
