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

export interface SafeDeletionModalProps {
    which: number
    open: boolean
    elementName?: string
    elementType: string
    onAction: () => void
    onClose: () => void
    recipes: string[]
}

export const SafeDeletionModal = ({
    which,
    open,
    elementName = '???',
    elementType,
    onAction,
    onClose,
    recipes,
}: SafeDeletionModalProps) =>
    which === 2 ? (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{`${elementName} jest w użyciu`}</DialogTitle>

            <DialogContent dividers>
                <DialogContentText>{`${elementType[0].toUpperCase() + elementType.slice(1)} o nazwie ${elementName} jest używany w następujących przepisach: `}</DialogContentText>
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
            <DialogTitle>{`Usunąć ${elementName}?`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`Czy aby napewno chcesz usunąć ${elementType} o nazwie ${elementName}?`}
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
