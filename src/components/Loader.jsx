import React from 'react'
import { Grid } from 'react-loader-spinner'

const Loader = () => {
  return (
    <Grid
      height="100"
      width="100"
      color='#cf0000'
      ariaLabel='loading'
    />
  )
}

export default Loader