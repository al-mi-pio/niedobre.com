import { MissingValues, NutrientValues } from '@/types/Ingredient'
import { IconButton, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'

interface PropertiesListProps {
    missingIngredientValues: MissingValues
    properties: NutrientValues
}

interface PropertyProps extends PropertiesListProps {
    property: keyof NutrientValues
    primary: string
    secondary: string
    titleName: string
}

const Property = ({
    properties,
    missingIngredientValues,
    property,
    primary,
    secondary,
    titleName,
}: PropertyProps) =>
    properties[property] ? (
        <ListItem>
            {missingIngredientValues[property] && (
                <ListItemIcon>
                    <Tooltip
                        title={`Co najmniej jeden ze składników nie posiada ${titleName}. Wynik może być niedokładny`}
                        placement="top"
                    >
                        <IconButton>
                            <WarningRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </ListItemIcon>
            )}
            <ListItemText
                inset={!missingIngredientValues[property]}
                primary={primary}
                secondary={secondary}
            />
        </ListItem>
    ) : null

export const PropertiesList = ({
    properties,
    missingIngredientValues,
}: PropertiesListProps) => (
    <>
        {properties.kcal && (
            <Property
                missingIngredientValues={missingIngredientValues}
                secondary={`${properties.kcal} kcal`}
                titleName="podanej wartości kalorycznej"
                primary="Wartość kaloryczna"
                properties={properties}
                property="kcal"
            />
        )}

        {properties.fat && (
            <Property
                missingIngredientValues={missingIngredientValues}
                secondary={`${properties.fat} g`}
                titleName="podanej zawartości tłuszczu"
                primary="Tłuszcz"
                properties={properties}
                property="fat"
            />
        )}

        {properties.carbohydrates && (
            <Property
                missingIngredientValues={missingIngredientValues}
                secondary={`${properties.carbohydrates} g`}
                titleName="podanej zawartości węglowodanów"
                primary="Węglowodany"
                properties={properties}
                property="carbohydrates"
            />
        )}

        {properties.protein && (
            <Property
                missingIngredientValues={missingIngredientValues}
                secondary={`${properties.protein} g`}
                titleName="podanej zawartości białka"
                primary="Białko"
                properties={properties}
                property="protein"
            />
        )}

        {properties.salt && (
            <Property
                missingIngredientValues={missingIngredientValues}
                secondary={`${properties.salt} g`}
                titleName="podanej zawartości soli"
                primary="Sól"
                properties={properties}
                property="salt"
            />
        )}
    </>
)
