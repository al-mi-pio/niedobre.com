import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import {
    DialogContentText,
    DialogTitle,
    ListItem,
    Button,
    List,
    Dialog,
    ListItemIcon,
    ListItemText,
    DialogActions,
    DialogContent,
} from '@mui/material'

interface Props {
    which: number
    open: boolean
    ingredientName?: string
    onAction: () => void
    onClose: () => void
    recipes: string[]
}

export const IngredientModal = ({
    which,
    open,
    ingredientName = '???',
    onAction,
    onClose,
    recipes,
}: Props) =>
    which === 2 ? (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{`${ingredientName} jest w użyciu`}</DialogTitle>

            <DialogContent dividers>
                <DialogContentText>{`Składnik o nazwie ${ingredientName} jest używany w następujących przepisach: `}</DialogContentText>
                <List>
                    {recipes.map((ingredient, i) => (
                        <ListItem key={i}>
                            <ListItemIcon>
                                <FiberManualRecordIcon sx={{ fontSize: '10px' }} />
                            </ListItemIcon>
                            <ListItemText primary={ingredient} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>

            <DialogContent sx={{ overflowY: 'visible' }}>
                <DialogContentText>
                    {'Czy zezwalasz na usunięcie go z tych przepisów?'}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>{'Nie'}</Button>
                <Button onClick={onAction} autoFocus>
                    {'Tak'}
                </Button>
            </DialogActions>
        </Dialog>
    ) : (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{`Usunąć ${ingredientName}?`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`Czy aby napewno chcesz usunąć składnik o nazwie ${ingredientName}?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{'Nie'}</Button>
                <Button onClick={onAction} autoFocus>
                    {'Tak'}
                </Button>
            </DialogActions>
        </Dialog>
    )
