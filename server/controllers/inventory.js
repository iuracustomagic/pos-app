const _0x155195=_0x4906,fs=(!function(){for(var t=_0x4906,r=_0x5f4b();;)try{if(242029==+parseInt(t(417))*(parseInt(t(483))/2)+parseInt(t(437))/3*(parseInt(t(473))/4)+parseInt(t(425))/5*(-parseInt(t(465))/6)+-parseInt(t(464))/7+-parseInt(t(456))/8*(-parseInt(t(477))/9)+-parseInt(t(482))/10+parseInt(t(495))/11*(parseInt(t(474))/12))break;r.push(r.shift())}catch(t){r.push(r.shift())}}(),require("fs")),logger=require(_0x155195(431)),{product,card}=require(_0x155195(501)+_0x155195(497)),PRODUCTS_DISPLAY=require(_0x155195(455)+"n")["PRODUCTS_DISPLAY"];async function getProducts(t,r){var e=_0x155195,o={VIlkg:function(t,r){return t===r},rTCEE:e(443),SpOYk:e(502),KzYCK:function(t,r){return t+r},opbjB:e(442),GtBTB:e(479),jBiWe:e(410),NXuMj:e(503),ffldG:e(466)};try{var a,n=JSON[e(423)](t[e(475)][e(424)]),d=(console[e(415)](n),await product[e(453)]([{$match:n},...o[e(491)](t[e(475)][e(418)],o[e(434)])?[]:[{$unwind:o[e(416)]}],{$sort:{"addition.popularity":-1}},{$skip:+t[e(475)][e(411)]},{$limit:o[e(458)](PRODUCTS_DISPLAY,1)},{$lookup:{from:o[e(432)],foreignField:o[e(496)],localField:o[e(468)],as:o[e(468)]}},{$replaceWith:{$mergeObjects:[o[e(469)],...o[e(491)](t[e(475)][e(418)],o[e(434)])?[]:[o[e(416)],{addition:null}]]}}]));t[e(475)][e(466)]?([a]=await product[e(453)]([{$unwind:o[e(416)]},{$match:JSON[e(423)](t[e(475)][e(424)])},{$count:o[e(420)]}]),r[e(505)]({products:d,...a})):r[e(505)]({products:d})}catch(t){logger[e(450)](t[e(441)]),r[e(493)](500)[e(505)](t[e(441)])}}async function getProductByFilter(t,r){var e=_0x155195,o={rQlwF:e(502),hCTHH:e(442),ZHNBF:e(479),jRtBR:e(410),ALTLP:e(503),orRLh:e(476)+e(470),ZrAZo:e(467)+e(422)};try{var a=JSON[e(423)](t[e(475)][e(424)]||"{}"),[n]=await product[e(453)]([{$unwind:o[e(433)]},{$match:{"addition.barcode":a[e(449)]}},{$lookup:{from:o[e(471)],foreignField:o[e(472)],localField:o[e(457)],as:o[e(457)]}},{$replaceWith:{$mergeObjects:[o[e(433)],o[e(440)],{addition:null}]}}]);if(!n){if(!a[e(449)])throw new Error(o[e(508)]);var d=await card[e(506)]({code:a[e(449)]});if(d)return void r[e(505)]({discount:d});throw new Error(o[e(419)])}r[e(505)]({product:n})}catch(t){r[e(493)](500)[e(505)](t[e(441)])}}async function addProduct(t,r){const e=_0x155195,o={wcbmk:e(414)+e(427)+e(481),cEutr:e(502),myYLT:e(466),IKwVd:e(504)+e(480)+e(462)+e(435)};try{if(!t[e(510)][e(429)][e(507)])throw new Error(o[e(461)]);const[a]=await product[e(453)]([{$unwind:o[e(446)]},{$count:o[e(490)]}]);await product[e(438)]({...t[e(498)][e(429)],addition:(t[e(498)][e(429)][e(448)]||[])[e(451)](t=>({...t,popularity:+(1-1/a[e(466)])[e(499)](5)}))}),r[e(505)](!0)}catch(t){logger[e(450)](t[e(441)]),r[e(493)](500)[e(505)](o[e(444)])}}function _0x4906(t,r){const e=_0x5f4b();return(_0x4906=function(t,r){return t-=410,e[t]})(t,r)}async function updateProduct(t,r){var e,o=_0x155195,a={BcgKH:o(414)+o(427)+o(481),PMzzg:function(t,r){return r<t}};try{if(!t[o(510)][o(429)][o(507)])throw new Error(a[o(426)]);t[o(498)][o(429)][o(452)]&&(e=fs[o(460)+"c"](process[o(486)][o(478)]+(o(445)+o(494))),a[o(463)](e[o(439)](t[o(498)][o(429)][o(452)]),-1)&&fs[o(484)](process[o(486)][o(478)]+(o(445)+o(500))+t[o(498)][o(429)][o(452)]),delete t[o(498)][o(429)][o(452)]),t[o(498)][o(429)][o(410)]?.[o(489)]||delete t[o(498)][o(429)][o(410)],await product[o(485)]({_id:t[o(498)][o(429)][o(479)]},t[o(498)][o(429)]),r[o(505)](!0)}catch(t){logger[o(450)](t[o(441)]),r[o(493)](500)[o(505)](t[o(441)])}}function _0x5f4b(){const t=["updateOne","env","exports","CltWS","length","myYLT","VIlkg","aEMDk","status","ages","220VrLsic","GtBTB","index","body","toFixed","ages/","../schema/","$addition","$$ROOT","An error o","send","findOne","admin","orRLh","pbvHn","jwt","discount","state","img","default.jp","You don't ","log","SpOYk","227182KwnSoP","unwind","ZrAZo","ffldG","nd a produ"," найден!","parse","filter","965OzeEdb","BcgKH","have this ","Didn't fou","data","updateMany","../logger","opbjB","rQlwF","rTCEE"," a product","deleteOne","3alLfwx","create","indexOf","ALTLP","message","discounts","false","IKwVd","/public/im","cEutr","ct to dele","addition","barcode","info","map","oldImg","aggregate","jVSbC","../env.jso","88Lsoazg","jRtBR","KzYCK","deletedCou","readdirSyn","wcbmk","ile adding","PMzzg","2842308Duayxu","822aHveCJ","total","Продукт не","jBiWe","NXuMj"," search!","hCTHH","ZHNBF","150852fWGoiT","58884eggdmR","query","Nothing to","195273qvShRC","extra","_id","ccurred wh","permission","1543700JulajF","4ChFCZx","unlinkSync"];return(_0x5f4b=function(){return t})()}async function deleteProduct(t,r){var e=_0x155195,o={aEMDk:e(414)+e(427)+e(481),pbvHn:function(t,r){return t!==r},CltWS:e(428)+e(421)+e(447)+"te",jVSbC:e(413)+"g"};try{if(!t[e(510)][e(429)][e(507)])throw new Error(o[e(492)]);var a=await product[e(436)]({_id:t[e(475)].id});if(o[e(509)](a[e(459)+"nt"],1))throw new Error(o[e(488)]);o[e(509)](t[e(475)][e(412)],o[e(454)])&&fs[e(484)](process[e(486)][e(478)]+(e(445)+e(500))+t[e(475)][e(412)],t=>{if(t)throw t}),r[e(505)](!0)}catch(t){logger[e(450)](t[e(441)]),r[e(493)](500)[e(505)](t[e(441)])}}async function updateIfCategoryWasEditted(t,r){var e=_0x155195;try{return await product[e(430)]({category:t},{category:r})}catch(t){return logger[e(450)](t[e(441)]),t}}module[_0x155195(487)]={getProducts:getProducts,getProductByFilter:getProductByFilter,updateProduct:updateProduct,addProduct:addProduct,deleteProduct:deleteProduct,updateIfCategoryWasEditted:updateIfCategoryWasEditted};