import { Grid } from '@mui/system'
import { CircularProgress } from '@mui/material'

const Spinner = () => (
    <Grid
        container
        sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Grid>
            <CircularProgress sx={{ margin: 'auto' }} />
        </Grid>
    </Grid>
)

export default Spinner
