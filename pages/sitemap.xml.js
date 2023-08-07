import { getSellers, getBuyers, getCategories, listProduceTypes } from '../helpers/lib'
import moment from 'moment'
import { getValidUrl } from '../helpers/utils/helpers';

const Sitemap = () => {};
const toUrl = (route) =>
  `<url><loc>${route.url}</loc><lastmod>${route.lastmod}</lastmod></url>`;
  
const createSitemap = (urlList) => 
  `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlList.map((url) => toUrl(url)).join("")}
    </urlset>`;
	
export async function getServerSideProps({ res, req }) {  
	let urlList = []
	const serverUrl = `https://${req.headers.host}`;
	const lastmod = "2022-01-01"
	const mainPages = [
		{
			"url": `${serverUrl}/`,
			"lastmod": lastmod
		},
		{
			"url": `${serverUrl}/about-us`,
			"lastmod": lastmod
		},
		{
			"url": `${serverUrl}/contact`,
			"lastmod": lastmod
		},
		{
			"url": `${serverUrl}/privacy`,
			"lastmod": lastmod
		},
		{
			"url": `${serverUrl}/reports`,
			"lastmod": lastmod
		},
		{
			"url": `${serverUrl}/seller-details`,
			"lastmod": lastmod
		},
		{
			"url": `${serverUrl}/terms`,
			"lastmod": lastmod
		},
	]
	const sellers = await getSellers()
	const sellerPages = sellers.map(s => {
		return {
			"url": getValidUrl(`${serverUrl}/seller/detail/${s.numeric_id}/${s.name}`),
			"lastmod": moment(s._datemodified).format('YYYY-MM-DD')
		}
	})
	const categories = await getCategories()
	const categoryPages = categories.map(c => {
		return {
			"url": getValidUrl(`${serverUrl}/produce/${c.numeric_id}/${c.name}`),
			"lastmod": moment(c._datemodified).format('YYYY-MM-DD')
		}
	})

	const reportCategoryPages = categories.map(c => {
		return {
			"url": getValidUrl(`${serverUrl}/report/${c.numeric_id}/${c.name}`),
			"lastmod": moment(c._datemodified).format('YYYY-MM-DD')
		}
	})
	const types = await listProduceTypes()
	const typePages = types.map(c => {
		return {
			"url": getValidUrl(`${serverUrl}/produce-sub/${c.numeric_id}/${c.name}`),
			"lastmod": moment(c._datemodified).format('YYYY-MM-DD')
		}
	})
	urlList = [
		...mainPages,
		...sellerPages,
		...categoryPages,
		...reportCategoryPages,
		...typePages,
	]
	
	const sitemap = createSitemap(urlList);
	res.setHeader("Content-Type", "text/xml");
	res.write(sitemap);
	res.end();
	return { props: { results : {urlList}}}
};
export default Sitemap;