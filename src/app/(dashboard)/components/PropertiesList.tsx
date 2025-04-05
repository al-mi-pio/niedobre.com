import { ListItem, ListItemText } from '@mui/material'

export const PropertiesList = ({ properties }: { properties: { kcal: number } }) => (
    <ListItem>
        {!!properties.kcal && (
            <ListItemText
                primary="Wartość kaloryczna"
                secondary={`${properties.kcal} kcal`}
            />
        )}
    </ListItem>
)
