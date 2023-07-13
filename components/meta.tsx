// components/Meta.tsx
import Head from 'next/head'

interface MetaProps {
  title?: string;
  keywords?: string;
  description?: string;
}

const Meta: React.FC<MetaProps> = ({ title = 'WebDev Newz', keywords = 'web development, programming', description = 'Get the latest news in web dev' }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
  )
}

Meta.defaultProps = {
  title: 'ForHosts',
  keywords: 'Rental Properties, Make your own rental site, Rentals',
  description: 'Generate a dynamic site for your customers that has all your own listings!',
}
export default Meta
