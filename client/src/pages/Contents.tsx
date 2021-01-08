import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useQuery } from 'react-query';
import { articlesApi } from '../api';

// const ContentsPage = () => {
//   const contents = useQuery([articlesApi.name]);
//
//   return (
//     <Grid>
//       {contents.map((content) => {
//         const {} = content;
//         return <Typography></Typography>;
//       })}
//     </Grid>
//   );
// };
//
// export default memo(Contents);
