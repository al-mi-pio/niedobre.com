import { ListItem, ListItemText } from '@mui/material'
import { nutrientValues } from '@/types/Ingredient'

export const PropertiesList = ({ properties }: { properties: nutrientValues }) => (
    <ListItem>
        {!!properties.kcal && (
            <ListItemText
                primary="Wartość kaloryczna"
                secondary={`${properties.kcal} kcal`}
            />
        )}
    </ListItem>
)
