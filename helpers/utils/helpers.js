import moment from 'moment'
import styled from 'styled-components'
import Resizer from "react-image-file-resizer"

export const imageMaxSize = 400 * 1024

export const capitalize = (string) => {
	if (!string) return ''
	// prettier-ignore
	return string.trim().charAt(0).toUpperCase() + string.trim().slice(1)
}

export const isEmpty = (value) =>
	value === undefined ||
	value === 'undefined' ||
	value === null ||
	value === 'null' ||
	(typeof value === 'object' && Object.keys(value).length === 0) ||
	(typeof value === 'string' && value.trim().length === 0)

export const getBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result)
		reader.onerror = (error) => reject(error)
	})
}

// convert a blob to base64
export function blobToBase64(blob) {
	return new Promise((resolve, _) => {
		const reader = new FileReader()
		reader.onloadend = () => resolve(reader.result)
		reader.readAsDataURL(blob)
	})
}

export const getFileObjForAjax = (file, data) => {
	const type = file.type
	return {
		name: file.name,
		size: file.size,
		type,
		data: data.replace(`data:${type};base64,`, ''),
	}
}

export const getNextMonthFirst = () => moment().add(1, 'M').startOf('month').format('YYYY-MM-DD hh:mm:ss')
export const getNextMonth = () => moment().add(1, 'M').format('YYYY-MM-DD hh:mm:ss')

// get an image blob from url using fetch
const getImageBlob = function (url) {
	return new Promise(async (resolve) => {
		const response = await fetch(url)
		const blob = response.blob()
		resolve(blob)
	})
}

// combine the previous two functions to return a base64 encode image from url
export const getBase64OfImageUrl = async function (url) {
	const blob = await getImageBlob(url)
	const base64 = await blobToBase64(blob)
	return base64
}

export const getImageDimensions = (file) => {
	return new Promise ((resolved, rejected) => {
	  var i = new Image()
	  i.onload = function(){
		resolved({w: i.width, h: i.height})
	  };
	  i.src = file
	})
}

export const boxStyles = {
	borderRadius: 3,
	boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
}

export const BoxCard = styled.div`
	border-radius: 3px;
	background-color: #fff;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
`

export const formatPrice = (price) => {
	let formattedPrice = Number(price).toFixed(2)
	return `$${formattedPrice}`
}

export const resizeFile = (file, demensions, rate) => {
	const d = Math.sqrt(rate);
	return new Promise((resolve) => {
		Resizer.imageFileResizer(
		  file,
		  demensions.w/d,
		  demensions.h/d,
		  "PNG",
		  98,
		  0,
		  (uri) => {
			resolve(uri);
		  },
		  "base64"
		);
	});
}

export const getCompressedBase64 = async (blob) => {
	const originalBase64 = await blobToBase64(blob)

	let result = originalBase64

	const originalSize = originalBase64.length

	//console.log("originalSize:", originalSize)

	const rate = originalSize / imageMaxSize
	//console.log(`rate: ${rate}`)

	if (rate > 1) {
		const demensions = await getImageDimensions(originalBase64)
		result = await resizeFile(blob, demensions, rate)
	}

	//console.log("resultSize:", result.length)

	return result

}

export const getCroppedImg =(image, crop, fileName) => {
	// let image = this.imageRef;
	const canvas = document.createElement('canvas')
	const scaleX = image.naturalWidth / image.width
	const scaleY = image.naturalHeight / image.height
	canvas.width = Math.ceil(crop.width * scaleX)
	canvas.height = Math.ceil(crop.height * scaleY)
	const ctx = canvas.getContext('2d')
	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width * scaleX,
		crop.height * scaleY
		// 250,
		// 250
	)
	// As Base64 string
	// const base64Image = canvas.toDataURL('image/png');
	// As a blob
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				blob.name = fileName
				resolve(blob)
			},
			'image/png',
			1
		)
	})
}

export const sortByField = (data, field, desc = false) => {
	if (field.includes('date')) {
	  return data.sort((a, b) => {
		if (desc) {
		  return new Date(b[field]) - new Date(a[field]);
		} else {
		  return new Date(a[field]) - new Date(b[field]);
		}
	  });
	}
  
	return data.sort((a, b) => {
	  if (desc) {
		return Number(b[field]) - Number(a[field]);
	  } else {
		return Number(a[field]) - Number(b[field]);
	  }
	});
};

export const sortByName = (data, desc = false) => {  
	return data.sort((a, b) => {
	  if (desc) {
		if (b.name < a.name) {
			return -1;
		}
		if (b.name > a.name) {
			return 1;
		}
		return 0;
	  } else {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	  }
	});
};

export const sortSellersWithProduce = (sellers) => {
	let sellersWithProduce = sellers.filter(s => s.max_produce_price_from_date !== null);
	sellersWithProduce = sortByField(sellersWithProduce, 'max_produce_price_from_date', true);
	const sellersWithNoProduce = sellers.filter(s => s.max_produce_price_from_date === null);
	return [...sellersWithProduce, ...sellersWithNoProduce];
}

export const filterByPlan = (sellers, plan) => {
	return sortSellersWithProduce(sellers.filter(s => s?.membershipISbb_agrix_membership_typesID_data?.name === plan))
}

export const filterByNoPlan = (sellers) => {
	return sortSellersWithProduce(sellers.filter(s => !s?.membershipISbb_agrix_membership_typesID_data || !s?.membershipISbb_agrix_membership_typesID_data?.name))
}

export const sortSellersByPlan = sellers => {	
	const diamond = filterByPlan(sellers, 'Diamond')
	const platinum = filterByPlan(sellers, 'Platinum')
	const gold = filterByPlan(sellers, 'Gold')
	const blue = filterByPlan(sellers, 'Blue')
	const noPlan = filterByNoPlan(sellers)

	return [...diamond, ...platinum, ...gold, ...blue, ...noPlan]
}

export const getMembershipData = info => {
	let amount = '';
	let renewalDate = getNextMonth();
	if (info && info.period) {
		if (info.period.includes('monthly')) {
			amount = info.membership_month_priceNUM
		} else {
			amount = info.membership_month_priceNUM
		}
	}
	amount = parseFloat(amount).toFixed(2)
	renewalDate = moment(renewalDate).format('YYYY-MM-DD')
	return {
		amount,
		renewalDate
	};
}

export const addHttpsURL = s => {
	let url = s
	var prefix = 'https://';
	if (url.substr(0, prefix.length) !== prefix)
	{
		url = prefix + url;
	}
	return url
}

export const getArrayFromJson = json => {
	let result = []
	const str = json.replaceAll("'", '"');
	result = JSON.parse(str)
	return result
}

export const getMetaDescription = path => {
	let result = '';
	if (path === '/') {
		result= 'Agrixchange, your global produce marketplace where buyers meet sellers'
	} else if (path === '/about-us') {
		result= 'We connect buyer and sellers of Fresh Produce. Want to engage with the world of agriculture, Want a simple reliable platform to keep your customer in the know about you, your company and your produce? Agrixchange.com gives you the solutions you need to buy, sell and connect, Everyday! We have been involved the agriculture industry for 15 years, and seen what you go through, its a tough Market. Buyers and sellers want the same thing, always, PROFIT! Agriculture is the one arena were infomation really does make the difference. In an industry where prices change daily, we keep you on the pulse. Agrixchange.net is here to make your life easier, Allowing you to Prepare for that pricing Opportunity. Sometimes its not the price, If you are the only one with the stock! Agrixchange.net is here to help you manage your risk. We have the solution to put your updated prices in the hands of REAL Buyers from around the globe. Agrixchange.net is the easiest way to get frequently updated pricing from several countries though-out the year direct to the buyer.'
	} else if (path.includes('/produce/')) {
		const name = path.split(/[/]+/).pop();
		result = `This produce category is ${decodeURI(name)}`
	} else if (path.includes('/produce-sub/')) {
		const name = path.split(/[/]+/).pop();
		result = `This produce sub-category is ${decodeURI(name)}`
	} else if (path.includes('/report/')) {
		result = `Find reports on the latest produce trends and information around the world from our sellers`
	} else if (path.includes('/seller/detail/')) {
		const name = path.split(/[/]+/).pop();
		result = `This seller is ${decodeURI(name)}`
	} else if (path === '/contact') {
		result = `get in touch with someone on the agrixchange.com team`
	} else if (path === '/terms') {
		result = `Agrixchange.com terms of use`
	} else if (path === '/privacy') {
		result = `Agrixchange.com privacy policy`
	}
	return result;
}

export const getValidUrl = path => {
	if (!path) {
		return '';
	}
	let result = path.toLowerCase();
	result = result.replaceAll('(', '');
	result = result.replaceAll(')', '');
	result = result.replaceAll(' ', '_');
	return result;
}
  