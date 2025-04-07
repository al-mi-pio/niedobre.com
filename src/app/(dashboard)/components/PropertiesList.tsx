import { ListItem, ListItemText } from '@mui/material'
import { NutrientValues } from '@/types/Ingredient'

export const PropertiesList = ({ properties }: { properties: NutrientValues }) => (
    <ListItem>
        {!!properties.kcal && (
            <ListItemText
                primary="Wartość kaloryczna"
                secondary={`${properties.kcal} kcal`}
            />
        )}
    </ListItem>
)
