import React from 'react'
import { Helmet } from 'react-helmet-async'

const Title = ({
    title="ChatCrypt",
    description="this is a encrypted chat app upon defi helimen key exchange",
}) => {
  return (
   <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
   </Helmet>
  )
}

export default Title