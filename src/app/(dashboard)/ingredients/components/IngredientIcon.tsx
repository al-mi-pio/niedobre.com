import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import KebabDiningIcon from '@mui/icons-material/KebabDining'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import SportsRugbyIcon from '@mui/icons-material/SportsRugby'
import AppleIcon from '@mui/icons-material/Apple'
import CakeIcon from '@mui/icons-material/Cake'
import EggIcon from '@mui/icons-material/Egg'
import { FoodGroup } from '@/types/Ingredient'

const IngredientIcon = ({ group }: { group: FoodGroup }) => {
    switch (group) {
        case 'owoce':
            return <AppleIcon />
        case 'warzywa':
            return <LocalFloristIcon />
        case 'orzechy':
            return <SportsRugbyIcon />
        case 'nabiał':
            return <EggIcon />
        case 'mięso':
            return <KebabDiningIcon />
        case 'słodkie':
            return <CakeIcon />
        case 'pieczywo':
            return <BakeryDiningIcon />
        case 'tłuszcze':
            return <LunchDiningIcon />
        default:
            return <QuestionMarkIcon />
    }
}

export default IngredientIcon
