import { TransitRoute } from '../../types/transit';

export async function loadBuenosAiresRouteDetails(
  routeId: string
): Promise<TransitRoute | null> {
  switch (routeId) {
    case "151":
      return (await import('./routeDetails/route_151')).routeDetails;

    case "307":
      return (await import('./routeDetails/route_307')).routeDetails;

    case "308":
      return (await import('./routeDetails/route_308')).routeDetails;

    case "270":
      return (await import('./routeDetails/route_270')).routeDetails;

    case "271":
      return (await import('./routeDetails/route_271')).routeDetails;

    case "272":
      return (await import('./routeDetails/route_272')).routeDetails;

    case "48":
      return (await import('./routeDetails/route_48')).routeDetails;

    case "47":
      return (await import('./routeDetails/route_47')).routeDetails;

    case "57":
      return (await import('./routeDetails/route_57')).routeDetails;

    case "449":
      return (await import('./routeDetails/route_449')).routeDetails;

    case "450":
      return (await import('./routeDetails/route_450')).routeDetails;

    case "451":
      return (await import('./routeDetails/route_451')).routeDetails;

    case "100":
      return (await import('./routeDetails/route_100')).routeDetails;

    case "453":
      return (await import('./routeDetails/route_453')).routeDetails;

    case "50":
      return (await import('./routeDetails/route_50')).routeDetails;

    case "52":
      return (await import('./routeDetails/route_52')).routeDetails;

    case "53":
      return (await import('./routeDetails/route_53')).routeDetails;

    case "51":
      return (await import('./routeDetails/route_51')).routeDetails;

    case "106":
      return (await import('./routeDetails/route_106')).routeDetails;

    case "107":
      return (await import('./routeDetails/route_107')).routeDetails;

    case "104":
      return (await import('./routeDetails/route_104')).routeDetails;

    case "63":
      return (await import('./routeDetails/route_63')).routeDetails;

    case "452":
      return (await import('./routeDetails/route_452')).routeDetails;

    case "309":
      return (await import('./routeDetails/route_309')).routeDetails;

    case "310":
      return (await import('./routeDetails/route_310')).routeDetails;

    case "311":
      return (await import('./routeDetails/route_311')).routeDetails;

    case "312":
      return (await import('./routeDetails/route_312')).routeDetails;

    case "313":
      return (await import('./routeDetails/route_313')).routeDetails;

    case "314":
      return (await import('./routeDetails/route_314')).routeDetails;

    case "315":
      return (await import('./routeDetails/route_315')).routeDetails;

    case "316":
      return (await import('./routeDetails/route_316')).routeDetails;

    case "317":
      return (await import('./routeDetails/route_317')).routeDetails;

    case "318":
      return (await import('./routeDetails/route_318')).routeDetails;

    case "319":
      return (await import('./routeDetails/route_319')).routeDetails;

    case "1577":
      return (await import('./routeDetails/route_1577')).routeDetails;

    case "105":
      return (await import('./routeDetails/route_105')).routeDetails;

    case "202":
      return (await import('./routeDetails/route_202')).routeDetails;

    case "131":
      return (await import('./routeDetails/route_131')).routeDetails;

    case "132":
      return (await import('./routeDetails/route_132')).routeDetails;

    case "152":
      return (await import('./routeDetails/route_152')).routeDetails;

    case "162":
      return (await import('./routeDetails/route_162')).routeDetails;

    case "161":
      return (await import('./routeDetails/route_161')).routeDetails;

    case "160":
      return (await import('./routeDetails/route_160')).routeDetails;

    case "159":
      return (await import('./routeDetails/route_159')).routeDetails;

    case "158":
      return (await import('./routeDetails/route_158')).routeDetails;

    case "157":
      return (await import('./routeDetails/route_157')).routeDetails;

    case "156":
      return (await import('./routeDetails/route_156')).routeDetails;

    case "155":
      return (await import('./routeDetails/route_155')).routeDetails;

    case "154":
      return (await import('./routeDetails/route_154')).routeDetails;

    case "153":
      return (await import('./routeDetails/route_153')).routeDetails;

    case "108":
      return (await import('./routeDetails/route_108')).routeDetails;

    case "109":
      return (await import('./routeDetails/route_109')).routeDetails;

    case "62":
      return (await import('./routeDetails/route_62')).routeDetails;

    case "163":
      return (await import('./routeDetails/route_163')).routeDetails;

    case "164":
      return (await import('./routeDetails/route_164')).routeDetails;

    case "1770":
      return (await import('./routeDetails/route_1770')).routeDetails;

    case "70":
      return (await import('./routeDetails/route_70')).routeDetails;

    case "94":
      return (await import('./routeDetails/route_94')).routeDetails;

    case "76":
      return (await import('./routeDetails/route_76')).routeDetails;

    case "85":
      return (await import('./routeDetails/route_85')).routeDetails;

    case "84":
      return (await import('./routeDetails/route_84')).routeDetails;

    case "83":
      return (await import('./routeDetails/route_83')).routeDetails;

    case "82":
      return (await import('./routeDetails/route_82')).routeDetails;

    case "81":
      return (await import('./routeDetails/route_81')).routeDetails;

    case "80":
      return (await import('./routeDetails/route_80')).routeDetails;

    case "79":
      return (await import('./routeDetails/route_79')).routeDetails;

    case "77":
      return (await import('./routeDetails/route_77')).routeDetails;

    case "443":
      return (await import('./routeDetails/route_443')).routeDetails;

    case "78":
      return (await import('./routeDetails/route_78')).routeDetails;

    case "1715":
      return (await import('./routeDetails/route_1715')).routeDetails;

    case "320":
      return (await import('./routeDetails/route_320')).routeDetails;

    case "321":
      return (await import('./routeDetails/route_321')).routeDetails;

    case "322":
      return (await import('./routeDetails/route_322')).routeDetails;

    case "1578":
      return (await import('./routeDetails/route_1578')).routeDetails;

    case "1671":
      return (await import('./routeDetails/route_1671')).routeDetails;

    case "1672":
      return (await import('./routeDetails/route_1672')).routeDetails;

    case "1673":
      return (await import('./routeDetails/route_1673')).routeDetails;

    case "1674":
      return (await import('./routeDetails/route_1674')).routeDetails;

    case "3038":
      return (await import('./routeDetails/route_3038')).routeDetails;

    case "3343":
      return (await import('./routeDetails/route_3343')).routeDetails;

    case "3344":
      return (await import('./routeDetails/route_3344')).routeDetails;

    case "3345":
      return (await import('./routeDetails/route_3345')).routeDetails;

    case "3346":
      return (await import('./routeDetails/route_3346')).routeDetails;

    case "3347":
      return (await import('./routeDetails/route_3347')).routeDetails;

    case "165":
      return (await import('./routeDetails/route_165')).routeDetails;

    case "273":
      return (await import('./routeDetails/route_273')).routeDetails;

    case "274":
      return (await import('./routeDetails/route_274')).routeDetails;

    case "275":
      return (await import('./routeDetails/route_275')).routeDetails;

    case "276":
      return (await import('./routeDetails/route_276')).routeDetails;

    case "302":
      return (await import('./routeDetails/route_302')).routeDetails;

    case "1734":
      return (await import('./routeDetails/route_1734')).routeDetails;

    case "1735":
      return (await import('./routeDetails/route_1735')).routeDetails;

    case "1736":
      return (await import('./routeDetails/route_1736')).routeDetails;

    case "1737":
      return (await import('./routeDetails/route_1737')).routeDetails;

    case "170":
      return (await import('./routeDetails/route_170')).routeDetails;

    case "469":
      return (await import('./routeDetails/route_469')).routeDetails;

    case "1740":
      return (await import('./routeDetails/route_1740')).routeDetails;

    case "1741":
      return (await import('./routeDetails/route_1741')).routeDetails;

    case "1742":
      return (await import('./routeDetails/route_1742')).routeDetails;

    case "6301":
      return (await import('./routeDetails/route_6301')).routeDetails;

    case "6302":
      return (await import('./routeDetails/route_6302')).routeDetails;

    case "325":
      return (await import('./routeDetails/route_325')).routeDetails;

    case "326":
      return (await import('./routeDetails/route_326')).routeDetails;

    case "327":
      return (await import('./routeDetails/route_327')).routeDetails;

    case "328":
      return (await import('./routeDetails/route_328')).routeDetails;

    case "329":
      return (await import('./routeDetails/route_329')).routeDetails;

    case "330":
      return (await import('./routeDetails/route_330')).routeDetails;

    case "1579":
      return (await import('./routeDetails/route_1579')).routeDetails;

    case "1580":
      return (await import('./routeDetails/route_1580')).routeDetails;

    case "1581":
      return (await import('./routeDetails/route_1581')).routeDetails;

    case "331":
      return (await import('./routeDetails/route_331')).routeDetails;

    case "101":
      return (await import('./routeDetails/route_101')).routeDetails;

    case "455":
      return (await import('./routeDetails/route_455')).routeDetails;

    case "64":
      return (await import('./routeDetails/route_64')).routeDetails;

    case "203":
      return (await import('./routeDetails/route_203')).routeDetails;

    case "303":
      return (await import('./routeDetails/route_303')).routeDetails;

    case "304":
      return (await import('./routeDetails/route_304')).routeDetails;

    case "305":
      return (await import('./routeDetails/route_305')).routeDetails;

    case "277":
      return (await import('./routeDetails/route_277')).routeDetails;

    case "278":
      return (await import('./routeDetails/route_278')).routeDetails;

    case "3738":
      return (await import('./routeDetails/route_3738')).routeDetails;

    case "333":
      return (await import('./routeDetails/route_333')).routeDetails;

    case "334":
      return (await import('./routeDetails/route_334')).routeDetails;

    case "207":
      return (await import('./routeDetails/route_207')).routeDetails;

    case "279":
      return (await import('./routeDetails/route_279')).routeDetails;

    case "49":
      return (await import('./routeDetails/route_49')).routeDetails;

    case "46":
      return (await import('./routeDetails/route_46')).routeDetails;

    case "335":
      return (await import('./routeDetails/route_335')).routeDetails;

    case "336":
      return (await import('./routeDetails/route_336')).routeDetails;

    case "337":
      return (await import('./routeDetails/route_337')).routeDetails;

    case "338":
      return (await import('./routeDetails/route_338')).routeDetails;

    case "339":
      return (await import('./routeDetails/route_339')).routeDetails;

    case "1583":
      return (await import('./routeDetails/route_1583')).routeDetails;

    case "1584":
      return (await import('./routeDetails/route_1584')).routeDetails;

    case "1585":
      return (await import('./routeDetails/route_1585')).routeDetails;

    case "283":
      return (await import('./routeDetails/route_283')).routeDetails;

    case "280":
      return (await import('./routeDetails/route_280')).routeDetails;

    case "282":
      return (await import('./routeDetails/route_282')).routeDetails;

    case "281":
      return (await import('./routeDetails/route_281')).routeDetails;

    case "208":
      return (await import('./routeDetails/route_208')).routeDetails;

    case "209":
      return (await import('./routeDetails/route_209')).routeDetails;

    case "1751":
      return (await import('./routeDetails/route_1751')).routeDetails;

    case "1752":
      return (await import('./routeDetails/route_1752')).routeDetails;

    case "171":
      return (await import('./routeDetails/route_171')).routeDetails;

    case "173":
      return (await import('./routeDetails/route_173')).routeDetails;

    case "172":
      return (await import('./routeDetails/route_172')).routeDetails;

    case "1621":
      return (await import('./routeDetails/route_1621')).routeDetails;

    case "392":
      return (await import('./routeDetails/route_392')).routeDetails;

    case "206":
      return (await import('./routeDetails/route_206')).routeDetails;

    case "1967":
      return (await import('./routeDetails/route_1967')).routeDetails;

    case "1756":
      return (await import('./routeDetails/route_1756')).routeDetails;

    case "1753":
      return (await import('./routeDetails/route_1753')).routeDetails;

    case "394":
      return (await import('./routeDetails/route_394')).routeDetails;

    case "354":
      return (await import('./routeDetails/route_354')).routeDetails;

    case "1758":
      return (await import('./routeDetails/route_1758')).routeDetails;

    case "393":
      return (await import('./routeDetails/route_393')).routeDetails;

    case "1755":
      return (await import('./routeDetails/route_1755')).routeDetails;

    case "1760":
      return (await import('./routeDetails/route_1760')).routeDetails;

    case "1754":
      return (await import('./routeDetails/route_1754')).routeDetails;

    case "636":
      return (await import('./routeDetails/route_636')).routeDetails;

    case "391":
      return (await import('./routeDetails/route_391')).routeDetails;

    case "1757":
      return (await import('./routeDetails/route_1757')).routeDetails;

    case "1759":
      return (await import('./routeDetails/route_1759')).routeDetails;

    case "635":
      return (await import('./routeDetails/route_635')).routeDetails;

    case "1761":
      return (await import('./routeDetails/route_1761')).routeDetails;

    case "1762":
      return (await import('./routeDetails/route_1762')).routeDetails;

    case "210":
      return (await import('./routeDetails/route_210')).routeDetails;

    case "284":
      return (await import('./routeDetails/route_284')).routeDetails;

    case "285":
      return (await import('./routeDetails/route_285')).routeDetails;

    case "1528":
      return (await import('./routeDetails/route_1528')).routeDetails;

    case "1277":
      return (await import('./routeDetails/route_1277')).routeDetails;

    case "1289":
      return (await import('./routeDetails/route_1289')).routeDetails;

    case "1280":
      return (await import('./routeDetails/route_1280')).routeDetails;

    case "1281":
      return (await import('./routeDetails/route_1281')).routeDetails;

    case "1282":
      return (await import('./routeDetails/route_1282')).routeDetails;

    case "1283":
      return (await import('./routeDetails/route_1283')).routeDetails;

    case "1284":
      return (await import('./routeDetails/route_1284')).routeDetails;

    case "1285":
      return (await import('./routeDetails/route_1285')).routeDetails;

    case "1286":
      return (await import('./routeDetails/route_1286')).routeDetails;

    case "1287":
      return (await import('./routeDetails/route_1287')).routeDetails;

    case "1288":
      return (await import('./routeDetails/route_1288')).routeDetails;

    case "1290":
      return (await import('./routeDetails/route_1290')).routeDetails;

    case "1291":
      return (await import('./routeDetails/route_1291')).routeDetails;

    case "1292":
      return (await import('./routeDetails/route_1292')).routeDetails;

    case "1293":
      return (await import('./routeDetails/route_1293')).routeDetails;

    case "1294":
      return (await import('./routeDetails/route_1294')).routeDetails;

    case "1295":
      return (await import('./routeDetails/route_1295')).routeDetails;

    case "1296":
      return (await import('./routeDetails/route_1296')).routeDetails;

    case "1297":
      return (await import('./routeDetails/route_1297')).routeDetails;

    case "1298":
      return (await import('./routeDetails/route_1298')).routeDetails;

    case "4354":
      return (await import('./routeDetails/route_4354')).routeDetails;

    case "4357":
      return (await import('./routeDetails/route_4357')).routeDetails;

    case "134":
      return (await import('./routeDetails/route_134')).routeDetails;

    case "135":
      return (await import('./routeDetails/route_135')).routeDetails;

    case "340":
      return (await import('./routeDetails/route_340')).routeDetails;

    case "341":
      return (await import('./routeDetails/route_341')).routeDetails;

    case "342":
      return (await import('./routeDetails/route_342')).routeDetails;

    case "1044":
      return (await import('./routeDetails/route_1044')).routeDetails;

    case "86":
      return (await import('./routeDetails/route_86')).routeDetails;

    case "87":
      return (await import('./routeDetails/route_87')).routeDetails;

    case "211":
      return (await import('./routeDetails/route_211')).routeDetails;

    case "200":
      return (await import('./routeDetails/route_200')).routeDetails;

    case "461":
      return (await import('./routeDetails/route_461')).routeDetails;

    case "686":
      return (await import('./routeDetails/route_686')).routeDetails;

    case "212":
      return (await import('./routeDetails/route_212')).routeDetails;

    case "111":
      return (await import('./routeDetails/route_111')).routeDetails;

    case "112":
      return (await import('./routeDetails/route_112')).routeDetails;

    case "1668":
      return (await import('./routeDetails/route_1668')).routeDetails;

    case "343":
      return (await import('./routeDetails/route_343')).routeDetails;

    case "174":
      return (await import('./routeDetails/route_174')).routeDetails;

    case "175":
      return (await import('./routeDetails/route_175')).routeDetails;

    case "65":
      return (await import('./routeDetails/route_65')).routeDetails;

    case "1669":
      return (await import('./routeDetails/route_1669')).routeDetails;

    case "176":
      return (await import('./routeDetails/route_176')).routeDetails;

    case "178":
      return (await import('./routeDetails/route_178')).routeDetails;

    case "177":
      return (await import('./routeDetails/route_177')).routeDetails;

    case "344":
      return (await import('./routeDetails/route_344')).routeDetails;

    case "345":
      return (await import('./routeDetails/route_345')).routeDetails;

    case "346":
      return (await import('./routeDetails/route_346')).routeDetails;

    case "347":
      return (await import('./routeDetails/route_347')).routeDetails;

    case "348":
      return (await import('./routeDetails/route_348')).routeDetails;

    case "349":
      return (await import('./routeDetails/route_349')).routeDetails;

    case "350":
      return (await import('./routeDetails/route_350')).routeDetails;

    case "351":
      return (await import('./routeDetails/route_351')).routeDetails;

    case "1588":
      return (await import('./routeDetails/route_1588')).routeDetails;

    case "1589":
      return (await import('./routeDetails/route_1589')).routeDetails;

    case "352":
      return (await import('./routeDetails/route_352')).routeDetails;

    case "353":
      return (await import('./routeDetails/route_353')).routeDetails;

    case "355":
      return (await import('./routeDetails/route_355')).routeDetails;

    case "1590":
      return (await import('./routeDetails/route_1590')).routeDetails;

    case "1591":
      return (await import('./routeDetails/route_1591')).routeDetails;

    case "71":
      return (await import('./routeDetails/route_71')).routeDetails;

    case "213":
      return (await import('./routeDetails/route_213')).routeDetails;

    case "286":
      return (await import('./routeDetails/route_286')).routeDetails;

    case "287":
      return (await import('./routeDetails/route_287')).routeDetails;

    case "288":
      return (await import('./routeDetails/route_288')).routeDetails;

    case "214":
      return (await import('./routeDetails/route_214')).routeDetails;

    case "216":
      return (await import('./routeDetails/route_216')).routeDetails;

    case "217":
      return (await import('./routeDetails/route_217')).routeDetails;

    case "215":
      return (await import('./routeDetails/route_215')).routeDetails;

    case "204":
      return (await import('./routeDetails/route_204')).routeDetails;

    case "306":
      return (await import('./routeDetails/route_306')).routeDetails;

    case "1771":
      return (await import('./routeDetails/route_1771')).routeDetails;

    case "1772":
      return (await import('./routeDetails/route_1772')).routeDetails;

    case "179":
      return (await import('./routeDetails/route_179')).routeDetails;

    case "181":
      return (await import('./routeDetails/route_181')).routeDetails;

    case "180":
      return (await import('./routeDetails/route_180')).routeDetails;

    case "289":
      return (await import('./routeDetails/route_289')).routeDetails;

    case "290":
      return (await import('./routeDetails/route_290')).routeDetails;

    case "291":
      return (await import('./routeDetails/route_291')).routeDetails;

    case "292":
      return (await import('./routeDetails/route_292')).routeDetails;

    case "293":
      return (await import('./routeDetails/route_293')).routeDetails;

    case "294":
      return (await import('./routeDetails/route_294')).routeDetails;

    case "295":
      return (await import('./routeDetails/route_295')).routeDetails;

    case "296":
      return (await import('./routeDetails/route_296')).routeDetails;

    case "297":
      return (await import('./routeDetails/route_297')).routeDetails;

    case "298":
      return (await import('./routeDetails/route_298')).routeDetails;

    case "300":
      return (await import('./routeDetails/route_300')).routeDetails;

    case "299":
      return (await import('./routeDetails/route_299')).routeDetails;

    case "638":
      return (await import('./routeDetails/route_638')).routeDetails;

    case "1964":
      return (await import('./routeDetails/route_1964')).routeDetails;

    case "2474":
      return (await import('./routeDetails/route_2474')).routeDetails;

    case "2475":
      return (await import('./routeDetails/route_2475')).routeDetails;

    case "182":
      return (await import('./routeDetails/route_182')).routeDetails;

    case "184":
      return (await import('./routeDetails/route_184')).routeDetails;

    case "183":
      return (await import('./routeDetails/route_183')).routeDetails;

    case "185":
      return (await import('./routeDetails/route_185')).routeDetails;

    case "1633":
      return (await import('./routeDetails/route_1633')).routeDetails;

    case "1634":
      return (await import('./routeDetails/route_1634')).routeDetails;

    case "301":
      return (await import('./routeDetails/route_301')).routeDetails;

    case "1731":
      return (await import('./routeDetails/route_1731')).routeDetails;

    case "1732":
      return (await import('./routeDetails/route_1732')).routeDetails;

    case "3940":
      return (await import('./routeDetails/route_3940')).routeDetails;

    case "221":
      return (await import('./routeDetails/route_221')).routeDetails;

    case "222":
      return (await import('./routeDetails/route_222')).routeDetails;

    case "223":
      return (await import('./routeDetails/route_223')).routeDetails;

    case "356":
      return (await import('./routeDetails/route_356')).routeDetails;

    case "357":
      return (await import('./routeDetails/route_357')).routeDetails;

    case "224":
      return (await import('./routeDetails/route_224')).routeDetails;

    case "1791":
      return (await import('./routeDetails/route_1791')).routeDetails;

    case "1792":
      return (await import('./routeDetails/route_1792')).routeDetails;

    case "1793":
      return (await import('./routeDetails/route_1793')).routeDetails;

    case "1794":
      return (await import('./routeDetails/route_1794')).routeDetails;

    case "1795":
      return (await import('./routeDetails/route_1795')).routeDetails;

    case "1796":
      return (await import('./routeDetails/route_1796')).routeDetails;

    case "1797":
      return (await import('./routeDetails/route_1797')).routeDetails;

    case "1798":
      return (await import('./routeDetails/route_1798')).routeDetails;

    case "225":
      return (await import('./routeDetails/route_225')).routeDetails;

    case "226":
      return (await import('./routeDetails/route_226')).routeDetails;

    case "227":
      return (await import('./routeDetails/route_227')).routeDetails;

    case "228":
      return (await import('./routeDetails/route_228')).routeDetails;

    case "229":
      return (await import('./routeDetails/route_229')).routeDetails;

    case "230":
      return (await import('./routeDetails/route_230')).routeDetails;

    case "231":
      return (await import('./routeDetails/route_231')).routeDetails;

    case "232":
      return (await import('./routeDetails/route_232')).routeDetails;

    case "1773":
      return (await import('./routeDetails/route_1773')).routeDetails;

    case "1774":
      return (await import('./routeDetails/route_1774')).routeDetails;

    case "1775":
      return (await import('./routeDetails/route_1775')).routeDetails;

    case "1776":
      return (await import('./routeDetails/route_1776')).routeDetails;

    case "1777":
      return (await import('./routeDetails/route_1777')).routeDetails;

    case "1778":
      return (await import('./routeDetails/route_1778')).routeDetails;

    case "1779":
      return (await import('./routeDetails/route_1779')).routeDetails;

    case "1780":
      return (await import('./routeDetails/route_1780')).routeDetails;

    case "1781":
      return (await import('./routeDetails/route_1781')).routeDetails;

    case "1782":
      return (await import('./routeDetails/route_1782')).routeDetails;

    case "1783":
      return (await import('./routeDetails/route_1783')).routeDetails;

    case "1784":
      return (await import('./routeDetails/route_1784')).routeDetails;

    case "1785":
      return (await import('./routeDetails/route_1785')).routeDetails;

    case "1786":
      return (await import('./routeDetails/route_1786')).routeDetails;

    case "1787":
      return (await import('./routeDetails/route_1787')).routeDetails;

    case "1788":
      return (await import('./routeDetails/route_1788')).routeDetails;

    case "1789":
      return (await import('./routeDetails/route_1789')).routeDetails;

    case "1790":
      return (await import('./routeDetails/route_1790')).routeDetails;

    case "233":
      return (await import('./routeDetails/route_233')).routeDetails;

    case "234":
      return (await import('./routeDetails/route_234')).routeDetails;

    case "235":
      return (await import('./routeDetails/route_235')).routeDetails;

    case "236":
      return (await import('./routeDetails/route_236')).routeDetails;

    case "237":
      return (await import('./routeDetails/route_237')).routeDetails;

    case "238":
      return (await import('./routeDetails/route_238')).routeDetails;

    case "239":
      return (await import('./routeDetails/route_239')).routeDetails;

    case "240":
      return (await import('./routeDetails/route_240')).routeDetails;

    case "241":
      return (await import('./routeDetails/route_241')).routeDetails;

    case "4349":
      return (await import('./routeDetails/route_4349')).routeDetails;

    case "136":
      return (await import('./routeDetails/route_136')).routeDetails;

    case "139":
      return (await import('./routeDetails/route_139')).routeDetails;

    case "138":
      return (await import('./routeDetails/route_138')).routeDetails;

    case "44":
      return (await import('./routeDetails/route_44')).routeDetails;

    case "45":
      return (await import('./routeDetails/route_45')).routeDetails;

    case "201":
      return (await import('./routeDetails/route_201')).routeDetails;

    case "358":
      return (await import('./routeDetails/route_358')).routeDetails;

    case "242":
      return (await import('./routeDetails/route_242')).routeDetails;

    case "639":
      return (await import('./routeDetails/route_639')).routeDetails;

    case "640":
      return (await import('./routeDetails/route_640')).routeDetails;

    case "641":
      return (await import('./routeDetails/route_641')).routeDetails;

    case "243":
      return (await import('./routeDetails/route_243')).routeDetails;

    case "244":
      return (await import('./routeDetails/route_244')).routeDetails;

    case "113":
      return (await import('./routeDetails/route_113')).routeDetails;

    case "102":
      return (await import('./routeDetails/route_102')).routeDetails;

    case "1801":
      return (await import('./routeDetails/route_1801')).routeDetails;

    case "103":
      return (await import('./routeDetails/route_103')).routeDetails;

    case "114":
      return (await import('./routeDetails/route_114')).routeDetails;

    case "1593":
      return (await import('./routeDetails/route_1593')).routeDetails;

    case "1594":
      return (await import('./routeDetails/route_1594')).routeDetails;

    case "115":
      return (await import('./routeDetails/route_115')).routeDetails;

    case "116":
      return (await import('./routeDetails/route_116')).routeDetails;

    case "186":
      return (await import('./routeDetails/route_186')).routeDetails;

    case "191":
      return (await import('./routeDetails/route_191')).routeDetails;

    case "190":
      return (await import('./routeDetails/route_190')).routeDetails;

    case "189":
      return (await import('./routeDetails/route_189')).routeDetails;

    case "188":
      return (await import('./routeDetails/route_188')).routeDetails;

    case "187":
      return (await import('./routeDetails/route_187')).routeDetails;

    case "245":
      return (await import('./routeDetails/route_245')).routeDetails;

    case "140":
      return (await import('./routeDetails/route_140')).routeDetails;

    case "141":
      return (await import('./routeDetails/route_141')).routeDetails;

    case "4361":
      return (await import('./routeDetails/route_4361')).routeDetails;

    case "4362":
      return (await import('./routeDetails/route_4362')).routeDetails;

    case "4363":
      return (await import('./routeDetails/route_4363')).routeDetails;

    case "68":
      return (await import('./routeDetails/route_68')).routeDetails;

    case "75":
      return (await import('./routeDetails/route_75')).routeDetails;

    case "192":
      return (await import('./routeDetails/route_192')).routeDetails;

    case "194":
      return (await import('./routeDetails/route_194')).routeDetails;

    case "193":
      return (await import('./routeDetails/route_193')).routeDetails;

    case "363":
      return (await import('./routeDetails/route_363')).routeDetails;

    case "1597":
      return (await import('./routeDetails/route_1597')).routeDetails;

    case "246":
      return (await import('./routeDetails/route_246')).routeDetails;

    case "2472":
      return (await import('./routeDetails/route_2472')).routeDetails;

    case "2473":
      return (await import('./routeDetails/route_2473')).routeDetails;

    case "365":
      return (await import('./routeDetails/route_365')).routeDetails;

    case "366":
      return (await import('./routeDetails/route_366')).routeDetails;

    case "1602":
      return (await import('./routeDetails/route_1602')).routeDetails;

    case "1603":
      return (await import('./routeDetails/route_1603')).routeDetails;

    case "3739":
      return (await import('./routeDetails/route_3739')).routeDetails;

    case "3740":
      return (await import('./routeDetails/route_3740')).routeDetails;

    case "195":
      return (await import('./routeDetails/route_195')).routeDetails;

    case "466":
      return (await import('./routeDetails/route_466')).routeDetails;

    case "4364":
      return (await import('./routeDetails/route_4364')).routeDetails;

    case "4365":
      return (await import('./routeDetails/route_4365')).routeDetails;

    case "4366":
      return (await import('./routeDetails/route_4366')).routeDetails;

    case "4367":
      return (await import('./routeDetails/route_4367')).routeDetails;

    case "4368":
      return (await import('./routeDetails/route_4368')).routeDetails;

    case "4369":
      return (await import('./routeDetails/route_4369')).routeDetails;

    case "4370":
      return (await import('./routeDetails/route_4370')).routeDetails;

    case "4371":
      return (await import('./routeDetails/route_4371')).routeDetails;

    case "4372":
      return (await import('./routeDetails/route_4372')).routeDetails;

    case "4373":
      return (await import('./routeDetails/route_4373')).routeDetails;

    case "4374":
      return (await import('./routeDetails/route_4374')).routeDetails;

    case "4375":
      return (await import('./routeDetails/route_4375')).routeDetails;

    case "4376":
      return (await import('./routeDetails/route_4376')).routeDetails;

    case "4378":
      return (await import('./routeDetails/route_4378')).routeDetails;

    case "4379":
      return (await import('./routeDetails/route_4379')).routeDetails;

    case "4380":
      return (await import('./routeDetails/route_4380')).routeDetails;

    case "4381":
      return (await import('./routeDetails/route_4381')).routeDetails;

    case "4382":
      return (await import('./routeDetails/route_4382')).routeDetails;

    case "143":
      return (await import('./routeDetails/route_143')).routeDetails;

    case "144":
      return (await import('./routeDetails/route_144')).routeDetails;

    case "91":
      return (await import('./routeDetails/route_91')).routeDetails;

    case "93":
      return (await import('./routeDetails/route_93')).routeDetails;

    case "92":
      return (await import('./routeDetails/route_92')).routeDetails;

    case "6271":
      return (await import('./routeDetails/route_6271')).routeDetails;

    case "6272":
      return (await import('./routeDetails/route_6272')).routeDetails;

    case "6273":
      return (await import('./routeDetails/route_6273')).routeDetails;

    case "6274":
      return (await import('./routeDetails/route_6274')).routeDetails;

    case "145":
      return (await import('./routeDetails/route_145')).routeDetails;

    case "1663":
      return (await import('./routeDetails/route_1663')).routeDetails;

    case "66":
      return (await import('./routeDetails/route_66')).routeDetails;

    case "3705":
      return (await import('./routeDetails/route_3705')).routeDetails;

    case "3706":
      return (await import('./routeDetails/route_3706')).routeDetails;

    case "3707":
      return (await import('./routeDetails/route_3707')).routeDetails;

    case "3708":
      return (await import('./routeDetails/route_3708')).routeDetails;

    case "4358":
      return (await import('./routeDetails/route_4358')).routeDetails;

    case "4359":
      return (await import('./routeDetails/route_4359')).routeDetails;

    case "4360":
      return (await import('./routeDetails/route_4360')).routeDetails;

    case "6267":
      return (await import('./routeDetails/route_6267')).routeDetails;

    case "6269":
      return (await import('./routeDetails/route_6269')).routeDetails;

    case "6268":
      return (await import('./routeDetails/route_6268')).routeDetails;

    case "6270":
      return (await import('./routeDetails/route_6270')).routeDetails;

    case "378":
      return (await import('./routeDetails/route_378')).routeDetails;

    case "379":
      return (await import('./routeDetails/route_379')).routeDetails;

    case "1625":
      return (await import('./routeDetails/route_1625')).routeDetails;

    case "4391":
      return (await import('./routeDetails/route_4391')).routeDetails;

    case "4392":
      return (await import('./routeDetails/route_4392')).routeDetails;

    case "4393":
      return (await import('./routeDetails/route_4393')).routeDetails;

    case "4394":
      return (await import('./routeDetails/route_4394')).routeDetails;

    case "4395":
      return (await import('./routeDetails/route_4395')).routeDetails;

    case "4396":
      return (await import('./routeDetails/route_4396')).routeDetails;

    case "4397":
      return (await import('./routeDetails/route_4397')).routeDetails;

    case "117":
      return (await import('./routeDetails/route_117')).routeDetails;

    case "458":
      return (await import('./routeDetails/route_458')).routeDetails;

    case "474":
      return (await import('./routeDetails/route_474')).routeDetails;

    case "475":
      return (await import('./routeDetails/route_475')).routeDetails;

    case "476":
      return (await import('./routeDetails/route_476')).routeDetails;

    case "1670":
      return (await import('./routeDetails/route_1670')).routeDetails;

    case "477":
      return (await import('./routeDetails/route_477')).routeDetails;

    case "479":
      return (await import('./routeDetails/route_479')).routeDetails;

    case "478":
      return (await import('./routeDetails/route_478')).routeDetails;

    case "480":
      return (await import('./routeDetails/route_480')).routeDetails;

    case "481":
      return (await import('./routeDetails/route_481')).routeDetails;

    case "482":
      return (await import('./routeDetails/route_482')).routeDetails;

    case "67":
      return (await import('./routeDetails/route_67')).routeDetails;

    case "73":
      return (await import('./routeDetails/route_73')).routeDetails;

    case "69":
      return (await import('./routeDetails/route_69')).routeDetails;

    case "118":
      return (await import('./routeDetails/route_118')).routeDetails;

    case "464":
      return (await import('./routeDetails/route_464')).routeDetails;

    case "1563":
      return (await import('./routeDetails/route_1563')).routeDetails;

    case "3713":
      return (await import('./routeDetails/route_3713')).routeDetails;

    case "260":
      return (await import('./routeDetails/route_260')).routeDetails;

    case "196":
      return (await import('./routeDetails/route_196')).routeDetails;

    case "579":
      return (await import('./routeDetails/route_579')).routeDetails;

    case "261":
      return (await import('./routeDetails/route_261')).routeDetails;

    case "262":
      return (await import('./routeDetails/route_262')).routeDetails;

    case "574":
      return (await import('./routeDetails/route_574')).routeDetails;

    case "575":
      return (await import('./routeDetails/route_575')).routeDetails;

    case "576":
      return (await import('./routeDetails/route_576')).routeDetails;

    case "577":
      return (await import('./routeDetails/route_577')).routeDetails;

    case "581":
      return (await import('./routeDetails/route_581')).routeDetails;

    case "578":
      return (await import('./routeDetails/route_578')).routeDetails;

    case "582":
      return (await import('./routeDetails/route_582')).routeDetails;

    case "263":
      return (await import('./routeDetails/route_263')).routeDetails;

    case "264":
      return (await import('./routeDetails/route_264')).routeDetails;

    case "265":
      return (await import('./routeDetails/route_265')).routeDetails;

    case "266":
      return (await import('./routeDetails/route_266')).routeDetails;

    case "267":
      return (await import('./routeDetails/route_267')).routeDetails;

    case "268":
      return (await import('./routeDetails/route_268')).routeDetails;

    case "269":
      return (await import('./routeDetails/route_269')).routeDetails;

    case "1744":
      return (await import('./routeDetails/route_1744')).routeDetails;

    case "1745":
      return (await import('./routeDetails/route_1745')).routeDetails;

    case "1746":
      return (await import('./routeDetails/route_1746')).routeDetails;

    case "1747":
      return (await import('./routeDetails/route_1747')).routeDetails;

    case "1748":
      return (await import('./routeDetails/route_1748')).routeDetails;

    case "1749":
      return (await import('./routeDetails/route_1749')).routeDetails;

    case "1750":
      return (await import('./routeDetails/route_1750')).routeDetails;

    case "146":
      return (await import('./routeDetails/route_146')).routeDetails;

    case "147":
      return (await import('./routeDetails/route_147')).routeDetails;

    case "3709":
      return (await import('./routeDetails/route_3709')).routeDetails;

    case "3710":
      return (await import('./routeDetails/route_3710')).routeDetails;

    case "4355":
      return (await import('./routeDetails/route_4355')).routeDetails;

    case "642":
      return (await import('./routeDetails/route_642')).routeDetails;

    case "643":
      return (await import('./routeDetails/route_643')).routeDetails;

    case "644":
      return (await import('./routeDetails/route_644')).routeDetails;

    case "645":
      return (await import('./routeDetails/route_645')).routeDetails;

    case "646":
      return (await import('./routeDetails/route_646')).routeDetails;

    case "1534":
      return (await import('./routeDetails/route_1534')).routeDetails;

    case "537":
      return (await import('./routeDetails/route_537')).routeDetails;

    case "383":
      return (await import('./routeDetails/route_383')).routeDetails;

    case "647":
      return (await import('./routeDetails/route_647')).routeDetails;

    case "648":
      return (await import('./routeDetails/route_648')).routeDetails;

    case "649":
      return (await import('./routeDetails/route_649')).routeDetails;

    case "652":
      return (await import('./routeDetails/route_652')).routeDetails;

    case "148":
      return (await import('./routeDetails/route_148')).routeDetails;

    case "1637":
      return (await import('./routeDetails/route_1637')).routeDetails;

    case "388":
      return (await import('./routeDetails/route_388')).routeDetails;

    case "389":
      return (await import('./routeDetails/route_389')).routeDetails;

    case "3695":
      return (await import('./routeDetails/route_3695')).routeDetails;

    case "3696":
      return (await import('./routeDetails/route_3696')).routeDetails;

    case "3697":
      return (await import('./routeDetails/route_3697')).routeDetails;

    case "149":
      return (await import('./routeDetails/route_149')).routeDetails;

    case "654":
      return (await import('./routeDetails/route_654')).routeDetails;

    case "1805":
      return (await import('./routeDetails/route_1805')).routeDetails;

    case "1806":
      return (await import('./routeDetails/route_1806')).routeDetails;

    case "1807":
      return (await import('./routeDetails/route_1807')).routeDetails;

    case "1808":
      return (await import('./routeDetails/route_1808')).routeDetails;

    case "1809":
      return (await import('./routeDetails/route_1809')).routeDetails;

    case "1810":
      return (await import('./routeDetails/route_1810')).routeDetails;

    case "1811":
      return (await import('./routeDetails/route_1811')).routeDetails;

    case "1812":
      return (await import('./routeDetails/route_1812')).routeDetails;

    case "1813":
      return (await import('./routeDetails/route_1813')).routeDetails;

    case "1814":
      return (await import('./routeDetails/route_1814')).routeDetails;

    case "1815":
      return (await import('./routeDetails/route_1815')).routeDetails;

    case "1816":
      return (await import('./routeDetails/route_1816')).routeDetails;

    case "1817":
      return (await import('./routeDetails/route_1817')).routeDetails;

    case "1818":
      return (await import('./routeDetails/route_1818')).routeDetails;

    case "1224":
      return (await import('./routeDetails/route_1224')).routeDetails;

    case "1595":
      return (await import('./routeDetails/route_1595')).routeDetails;

    case "655":
      return (await import('./routeDetails/route_655')).routeDetails;

    case "656":
      return (await import('./routeDetails/route_656')).routeDetails;

    case "657":
      return (await import('./routeDetails/route_657')).routeDetails;

    case "658":
      return (await import('./routeDetails/route_658')).routeDetails;

    case "659":
      return (await import('./routeDetails/route_659')).routeDetails;

    case "660":
      return (await import('./routeDetails/route_660')).routeDetails;

    case "1231":
      return (await import('./routeDetails/route_1231')).routeDetails;

    case "1232":
      return (await import('./routeDetails/route_1232')).routeDetails;

    case "661":
      return (await import('./routeDetails/route_661')).routeDetails;

    case "662":
      return (await import('./routeDetails/route_662')).routeDetails;

    case "663":
      return (await import('./routeDetails/route_663')).routeDetails;

    case "664":
      return (await import('./routeDetails/route_664')).routeDetails;

    case "665":
      return (await import('./routeDetails/route_665')).routeDetails;

    case "1729":
      return (await import('./routeDetails/route_1729')).routeDetails;

    case "1730":
      return (await import('./routeDetails/route_1730')).routeDetails;

    case "1548":
      return (await import('./routeDetails/route_1548')).routeDetails;

    case "1549":
      return (await import('./routeDetails/route_1549')).routeDetails;

    case "197":
      return (await import('./routeDetails/route_197')).routeDetails;

    case "198":
      return (await import('./routeDetails/route_198')).routeDetails;

    case "666":
      return (await import('./routeDetails/route_666')).routeDetails;

    case "667":
      return (await import('./routeDetails/route_667')).routeDetails;

    case "668":
      return (await import('./routeDetails/route_668')).routeDetails;

    case "1804":
      return (await import('./routeDetails/route_1804')).routeDetails;

    case "6030":
      return (await import('./routeDetails/route_6030')).routeDetails;

    case "669":
      return (await import('./routeDetails/route_669')).routeDetails;

    case "1802":
      return (await import('./routeDetails/route_1802')).routeDetails;

    case "1803":
      return (await import('./routeDetails/route_1803')).routeDetails;

    case "120":
      return (await import('./routeDetails/route_120')).routeDetails;

    case "121":
      return (await import('./routeDetails/route_121')).routeDetails;

    case "122":
      return (await import('./routeDetails/route_122')).routeDetails;

    case "123":
      return (await import('./routeDetails/route_123')).routeDetails;

    case "124":
      return (await import('./routeDetails/route_124')).routeDetails;

    case "125":
      return (await import('./routeDetails/route_125')).routeDetails;

    case "126":
      return (await import('./routeDetails/route_126')).routeDetails;

    case "127":
      return (await import('./routeDetails/route_127')).routeDetails;

    case "442":
      return (await import('./routeDetails/route_442')).routeDetails;

    case "1799":
      return (await import('./routeDetails/route_1799')).routeDetails;

    case "1800":
      return (await import('./routeDetails/route_1800')).routeDetails;

    case "99":
      return (await import('./routeDetails/route_99')).routeDetails;

    case "444":
      return (await import('./routeDetails/route_444')).routeDetails;

    case "445":
      return (await import('./routeDetails/route_445')).routeDetails;

    case "446":
      return (await import('./routeDetails/route_446')).routeDetails;

    case "447":
      return (await import('./routeDetails/route_447')).routeDetails;

    case "448":
      return (await import('./routeDetails/route_448')).routeDetails;

    case "95":
      return (await import('./routeDetails/route_95')).routeDetails;

    case "97":
      return (await import('./routeDetails/route_97')).routeDetails;

    case "96":
      return (await import('./routeDetails/route_96')).routeDetails;

    case "98":
      return (await import('./routeDetails/route_98')).routeDetails;

    case "1242":
      return (await import('./routeDetails/route_1242')).routeDetails;

    case "1243":
      return (await import('./routeDetails/route_1243')).routeDetails;

    case "1244":
      return (await import('./routeDetails/route_1244')).routeDetails;

    case "1245":
      return (await import('./routeDetails/route_1245')).routeDetails;

    case "1246":
      return (await import('./routeDetails/route_1246')).routeDetails;

    case "1247":
      return (await import('./routeDetails/route_1247')).routeDetails;

    case "1248":
      return (await import('./routeDetails/route_1248')).routeDetails;

    case "1249":
      return (await import('./routeDetails/route_1249')).routeDetails;

    case "1250":
      return (await import('./routeDetails/route_1250')).routeDetails;

    case "1176":
      return (await import('./routeDetails/route_1176')).routeDetails;

    case "1177":
      return (await import('./routeDetails/route_1177')).routeDetails;

    case "1178":
      return (await import('./routeDetails/route_1178')).routeDetails;

    case "1180":
      return (await import('./routeDetails/route_1180')).routeDetails;

    case "1182":
      return (await import('./routeDetails/route_1182')).routeDetails;

    case "1183":
      return (await import('./routeDetails/route_1183')).routeDetails;

    case "1184":
      return (await import('./routeDetails/route_1184')).routeDetails;

    case "2911":
      return (await import('./routeDetails/route_2911')).routeDetails;

    case "2914":
      return (await import('./routeDetails/route_2914')).routeDetails;

    case "2915":
      return (await import('./routeDetails/route_2915')).routeDetails;

    case "2917":
      return (await import('./routeDetails/route_2917')).routeDetails;

    case "2918":
      return (await import('./routeDetails/route_2918')).routeDetails;

    case "2919":
      return (await import('./routeDetails/route_2919')).routeDetails;

    case "2920":
      return (await import('./routeDetails/route_2920')).routeDetails;

    case "2921":
      return (await import('./routeDetails/route_2921')).routeDetails;

    case "894":
      return (await import('./routeDetails/route_894')).routeDetails;

    case "895":
      return (await import('./routeDetails/route_895')).routeDetails;

    case "2939":
      return (await import('./routeDetails/route_2939')).routeDetails;

    case "2941":
      return (await import('./routeDetails/route_2941')).routeDetails;

    case "546":
      return (await import('./routeDetails/route_546')).routeDetails;

    case "1201":
      return (await import('./routeDetails/route_1201')).routeDetails;

    case "1202":
      return (await import('./routeDetails/route_1202')).routeDetails;

    case "1393":
      return (await import('./routeDetails/route_1393')).routeDetails;

    case "2685":
      return (await import('./routeDetails/route_2685')).routeDetails;

    case "2686":
      return (await import('./routeDetails/route_2686')).routeDetails;

    case "2687":
      return (await import('./routeDetails/route_2687')).routeDetails;

    case "2684":
      return (await import('./routeDetails/route_2684')).routeDetails;

    case "2728":
      return (await import('./routeDetails/route_2728')).routeDetails;

    case "2729":
      return (await import('./routeDetails/route_2729')).routeDetails;

    case "2730":
      return (await import('./routeDetails/route_2730')).routeDetails;

    case "960":
      return (await import('./routeDetails/route_960')).routeDetails;

    case "947":
      return (await import('./routeDetails/route_947')).routeDetails;

    case "948":
      return (await import('./routeDetails/route_948')).routeDetails;

    case "949":
      return (await import('./routeDetails/route_949')).routeDetails;

    case "2942":
      return (await import('./routeDetails/route_2942')).routeDetails;

    case "2943":
      return (await import('./routeDetails/route_2943')).routeDetails;

    case "1063":
      return (await import('./routeDetails/route_1063')).routeDetails;

    case "2476":
      return (await import('./routeDetails/route_2476')).routeDetails;

    case "2628":
      return (await import('./routeDetails/route_2628')).routeDetails;

    case "780":
      return (await import('./routeDetails/route_780')).routeDetails;

    case "782":
      return (await import('./routeDetails/route_782')).routeDetails;

    case "783":
      return (await import('./routeDetails/route_783')).routeDetails;

    case "784":
      return (await import('./routeDetails/route_784')).routeDetails;

    case "785":
      return (await import('./routeDetails/route_785')).routeDetails;

    case "2973":
      return (await import('./routeDetails/route_2973')).routeDetails;

    case "2974":
      return (await import('./routeDetails/route_2974')).routeDetails;

    case "2975":
      return (await import('./routeDetails/route_2975')).routeDetails;

    case "2976":
      return (await import('./routeDetails/route_2976')).routeDetails;

    case "2977":
      return (await import('./routeDetails/route_2977')).routeDetails;

    case "2560":
      return (await import('./routeDetails/route_2560')).routeDetails;

    case "2561":
      return (await import('./routeDetails/route_2561')).routeDetails;

    case "2562":
      return (await import('./routeDetails/route_2562')).routeDetails;

    case "2563":
      return (await import('./routeDetails/route_2563')).routeDetails;

    case "547":
      return (await import('./routeDetails/route_547')).routeDetails;

    case "671":
      return (await import('./routeDetails/route_671')).routeDetails;

    case "672":
      return (await import('./routeDetails/route_672')).routeDetails;

    case "673":
      return (await import('./routeDetails/route_673')).routeDetails;

    case "674":
      return (await import('./routeDetails/route_674')).routeDetails;

    case "675":
      return (await import('./routeDetails/route_675')).routeDetails;

    case "2669":
      return (await import('./routeDetails/route_2669')).routeDetails;

    case "2671":
      return (await import('./routeDetails/route_2671')).routeDetails;

    case "2668":
      return (await import('./routeDetails/route_2668')).routeDetails;

    case "548":
      return (await import('./routeDetails/route_548')).routeDetails;

    case "2926":
      return (await import('./routeDetails/route_2926')).routeDetails;

    case "2927":
      return (await import('./routeDetails/route_2927')).routeDetails;

    case "2928":
      return (await import('./routeDetails/route_2928')).routeDetails;

    case "2812":
      return (await import('./routeDetails/route_2812')).routeDetails;

    case "2813":
      return (await import('./routeDetails/route_2813')).routeDetails;

    case "2814":
      return (await import('./routeDetails/route_2814')).routeDetails;

    case "2801":
      return (await import('./routeDetails/route_2801')).routeDetails;

    case "2802":
      return (await import('./routeDetails/route_2802')).routeDetails;

    case "3711":
      return (await import('./routeDetails/route_3711')).routeDetails;

    case "3041":
      return (await import('./routeDetails/route_3041')).routeDetails;

    case "2500":
      return (await import('./routeDetails/route_2500')).routeDetails;

    case "2804":
      return (await import('./routeDetails/route_2804')).routeDetails;

    case "2805":
      return (await import('./routeDetails/route_2805')).routeDetails;

    case "2806":
      return (await import('./routeDetails/route_2806')).routeDetails;

    case "2514":
      return (await import('./routeDetails/route_2514')).routeDetails;

    case "2515":
      return (await import('./routeDetails/route_2515')).routeDetails;

    case "2516":
      return (await import('./routeDetails/route_2516')).routeDetails;

    case "2507":
      return (await import('./routeDetails/route_2507')).routeDetails;

    case "2508":
      return (await import('./routeDetails/route_2508')).routeDetails;

    case "2509":
      return (await import('./routeDetails/route_2509')).routeDetails;

    case "2511":
      return (await import('./routeDetails/route_2511')).routeDetails;

    case "2510":
      return (await import('./routeDetails/route_2510')).routeDetails;

    case "787":
      return (await import('./routeDetails/route_787')).routeDetails;

    case "788":
      return (await import('./routeDetails/route_788')).routeDetails;

    case "789":
      return (await import('./routeDetails/route_789')).routeDetails;

    case "790":
      return (await import('./routeDetails/route_790')).routeDetails;

    case "791":
      return (await import('./routeDetails/route_791')).routeDetails;

    case "792":
      return (await import('./routeDetails/route_792')).routeDetails;

    case "2631":
      return (await import('./routeDetails/route_2631')).routeDetails;

    case "2633":
      return (await import('./routeDetails/route_2633')).routeDetails;

    case "2632":
      return (await import('./routeDetails/route_2632')).routeDetails;

    case "1203":
      return (await import('./routeDetails/route_1203')).routeDetails;

    case "1204":
      return (await import('./routeDetails/route_1204')).routeDetails;

    case "1205":
      return (await import('./routeDetails/route_1205')).routeDetails;

    case "1206":
      return (await import('./routeDetails/route_1206')).routeDetails;

    case "1213":
      return (await import('./routeDetails/route_1213')).routeDetails;

    case "1209":
      return (await import('./routeDetails/route_1209')).routeDetails;

    case "1210":
      return (await import('./routeDetails/route_1210')).routeDetails;

    case "1216":
      return (await import('./routeDetails/route_1216')).routeDetails;

    case "1215":
      return (await import('./routeDetails/route_1215')).routeDetails;

    case "1146":
      return (await import('./routeDetails/route_1146')).routeDetails;

    case "1147":
      return (await import('./routeDetails/route_1147')).routeDetails;

    case "1149":
      return (await import('./routeDetails/route_1149')).routeDetails;

    case "1152":
      return (await import('./routeDetails/route_1152')).routeDetails;

    case "1155":
      return (await import('./routeDetails/route_1155')).routeDetails;

    case "1036":
      return (await import('./routeDetails/route_1036')).routeDetails;

    case "1040":
      return (await import('./routeDetails/route_1040')).routeDetails;

    case "1039":
      return (await import('./routeDetails/route_1039')).routeDetails;

    case "1043":
      return (await import('./routeDetails/route_1043')).routeDetails;

    case "1037":
      return (await import('./routeDetails/route_1037')).routeDetails;

    case "1038":
      return (await import('./routeDetails/route_1038')).routeDetails;

    case "1042":
      return (await import('./routeDetails/route_1042')).routeDetails;

    case "2906":
      return (await import('./routeDetails/route_2906')).routeDetails;

    case "2907":
      return (await import('./routeDetails/route_2907')).routeDetails;

    case "757":
      return (await import('./routeDetails/route_757')).routeDetails;

    case "1107":
      return (await import('./routeDetails/route_1107')).routeDetails;

    case "2598":
      return (await import('./routeDetails/route_2598')).routeDetails;

    case "2597":
      return (await import('./routeDetails/route_2597')).routeDetails;

    case "1111":
      return (await import('./routeDetails/route_1111')).routeDetails;

    case "2540":
      return (await import('./routeDetails/route_2540')).routeDetails;

    case "2542":
      return (await import('./routeDetails/route_2542')).routeDetails;

    case "2543":
      return (await import('./routeDetails/route_2543')).routeDetails;

    case "2689":
      return (await import('./routeDetails/route_2689')).routeDetails;

    case "2688":
      return (await import('./routeDetails/route_2688')).routeDetails;

    case "4000":
      return (await import('./routeDetails/route_4000')).routeDetails;

    case "3925":
      return (await import('./routeDetails/route_3925')).routeDetails;

    case "2798":
      return (await import('./routeDetails/route_2798')).routeDetails;

    case "2799":
      return (await import('./routeDetails/route_2799')).routeDetails;

    case "2800":
      return (await import('./routeDetails/route_2800')).routeDetails;

    case "2797":
      return (await import('./routeDetails/route_2797')).routeDetails;

    case "2679":
      return (await import('./routeDetails/route_2679')).routeDetails;

    case "2678":
      return (await import('./routeDetails/route_2678')).routeDetails;

    case "2676":
      return (await import('./routeDetails/route_2676')).routeDetails;

    case "2677":
      return (await import('./routeDetails/route_2677')).routeDetails;

    case "2660":
      return (await import('./routeDetails/route_2660')).routeDetails;

    case "2661":
      return (await import('./routeDetails/route_2661')).routeDetails;

    case "2659":
      return (await import('./routeDetails/route_2659')).routeDetails;

    case "2658":
      return (await import('./routeDetails/route_2658')).routeDetails;

    case "2731":
      return (await import('./routeDetails/route_2731')).routeDetails;

    case "2732":
      return (await import('./routeDetails/route_2732')).routeDetails;

    case "2733":
      return (await import('./routeDetails/route_2733')).routeDetails;

    case "2922":
      return (await import('./routeDetails/route_2922')).routeDetails;

    case "2923":
      return (await import('./routeDetails/route_2923')).routeDetails;

    case "2924":
      return (await import('./routeDetails/route_2924')).routeDetails;

    case "1469":
      return (await import('./routeDetails/route_1469')).routeDetails;

    case "2739":
      return (await import('./routeDetails/route_2739')).routeDetails;

    case "2740":
      return (await import('./routeDetails/route_2740')).routeDetails;

    case "2741":
      return (await import('./routeDetails/route_2741')).routeDetails;

    case "2742":
      return (await import('./routeDetails/route_2742')).routeDetails;

    case "2743":
      return (await import('./routeDetails/route_2743')).routeDetails;

    case "2744":
      return (await import('./routeDetails/route_2744')).routeDetails;

    case "2745":
      return (await import('./routeDetails/route_2745')).routeDetails;

    case "2894":
      return (await import('./routeDetails/route_2894')).routeDetails;

    case "2898":
      return (await import('./routeDetails/route_2898')).routeDetails;

    case "2903":
      return (await import('./routeDetails/route_2903')).routeDetails;

    case "3420":
      return (await import('./routeDetails/route_3420')).routeDetails;

    case "2747":
      return (await import('./routeDetails/route_2747')).routeDetails;

    case "2748":
      return (await import('./routeDetails/route_2748')).routeDetails;

    case "2665":
      return (await import('./routeDetails/route_2665')).routeDetails;

    case "2666":
      return (await import('./routeDetails/route_2666')).routeDetails;

    case "2667":
      return (await import('./routeDetails/route_2667')).routeDetails;

    case "2617":
      return (await import('./routeDetails/route_2617')).routeDetails;

    case "2618":
      return (await import('./routeDetails/route_2618')).routeDetails;

    case "2619":
      return (await import('./routeDetails/route_2619')).routeDetails;

    case "2620":
      return (await import('./routeDetails/route_2620')).routeDetails;

    case "2621":
      return (await import('./routeDetails/route_2621')).routeDetails;

    case "3702":
      return (await import('./routeDetails/route_3702')).routeDetails;

    case "3703":
      return (await import('./routeDetails/route_3703')).routeDetails;

    case "2828":
      return (await import('./routeDetails/route_2828')).routeDetails;

    case "2829":
      return (await import('./routeDetails/route_2829')).routeDetails;

    case "2830":
      return (await import('./routeDetails/route_2830')).routeDetails;

    case "2831":
      return (await import('./routeDetails/route_2831')).routeDetails;

    case "2832":
      return (await import('./routeDetails/route_2832')).routeDetails;

    case "2827":
      return (await import('./routeDetails/route_2827')).routeDetails;

    case "1470":
      return (await import('./routeDetails/route_1470')).routeDetails;

    case "3712":
      return (await import('./routeDetails/route_3712')).routeDetails;

    case "3714":
      return (await import('./routeDetails/route_3714')).routeDetails;

    case "3027":
      return (await import('./routeDetails/route_3027')).routeDetails;

    case "3028":
      return (await import('./routeDetails/route_3028')).routeDetails;

    case "3029":
      return (await import('./routeDetails/route_3029')).routeDetails;

    case "3030":
      return (await import('./routeDetails/route_3030')).routeDetails;

    case "3034":
      return (await import('./routeDetails/route_3034')).routeDetails;

    case "3033":
      return (await import('./routeDetails/route_3033')).routeDetails;

    case "3035":
      return (await import('./routeDetails/route_3035')).routeDetails;

    case "3036":
      return (await import('./routeDetails/route_3036')).routeDetails;

    case "3037":
      return (await import('./routeDetails/route_3037')).routeDetails;

    case "3031":
      return (await import('./routeDetails/route_3031')).routeDetails;

    case "3032":
      return (await import('./routeDetails/route_3032')).routeDetails;

    case "511":
      return (await import('./routeDetails/route_511')).routeDetails;

    case "2594":
      return (await import('./routeDetails/route_2594')).routeDetails;

    case "2595":
      return (await import('./routeDetails/route_2595')).routeDetails;

    case "2596":
      return (await import('./routeDetails/route_2596')).routeDetails;

    case "3042":
      return (await import('./routeDetails/route_3042')).routeDetails;

    case "3043":
      return (await import('./routeDetails/route_3043')).routeDetails;

    case "3044":
      return (await import('./routeDetails/route_3044')).routeDetails;

    case "3045":
      return (await import('./routeDetails/route_3045')).routeDetails;

    case "2750":
      return (await import('./routeDetails/route_2750')).routeDetails;

    case "2749":
      return (await import('./routeDetails/route_2749')).routeDetails;

    case "2838":
      return (await import('./routeDetails/route_2838')).routeDetails;

    case "2860":
      return (await import('./routeDetails/route_2860')).routeDetails;

    case "3009":
      return (await import('./routeDetails/route_3009')).routeDetails;

    case "3010":
      return (await import('./routeDetails/route_3010')).routeDetails;

    case "3012":
      return (await import('./routeDetails/route_3012')).routeDetails;

    case "2566":
      return (await import('./routeDetails/route_2566')).routeDetails;

    case "2568":
      return (await import('./routeDetails/route_2568')).routeDetails;

    case "2569":
      return (await import('./routeDetails/route_2569')).routeDetails;

    case "2557":
      return (await import('./routeDetails/route_2557')).routeDetails;

    case "2558":
      return (await import('./routeDetails/route_2558')).routeDetails;

    case "12":
      return (await import('./routeDetails/route_12')).routeDetails;

    case "2950":
      return (await import('./routeDetails/route_2950')).routeDetails;

    case "2951":
      return (await import('./routeDetails/route_2951')).routeDetails;

    case "2952":
      return (await import('./routeDetails/route_2952')).routeDetails;

    case "2953":
      return (await import('./routeDetails/route_2953')).routeDetails;

    case "2954":
      return (await import('./routeDetails/route_2954')).routeDetails;

    case "2955":
      return (await import('./routeDetails/route_2955')).routeDetails;

    case "2956":
      return (await import('./routeDetails/route_2956')).routeDetails;

    case "2957":
      return (await import('./routeDetails/route_2957')).routeDetails;

    case "2958":
      return (await import('./routeDetails/route_2958')).routeDetails;

    case "2959":
      return (await import('./routeDetails/route_2959')).routeDetails;

    case "2960":
      return (await import('./routeDetails/route_2960')).routeDetails;

    case "2961":
      return (await import('./routeDetails/route_2961')).routeDetails;

    case "2962":
      return (await import('./routeDetails/route_2962')).routeDetails;

    case "2963":
      return (await import('./routeDetails/route_2963')).routeDetails;

    case "1087":
      return (await import('./routeDetails/route_1087')).routeDetails;

    case "1088":
      return (await import('./routeDetails/route_1088')).routeDetails;

    case "1089":
      return (await import('./routeDetails/route_1089')).routeDetails;

    case "1090":
      return (await import('./routeDetails/route_1090')).routeDetails;

    case "1091":
      return (await import('./routeDetails/route_1091')).routeDetails;

    case "1251":
      return (await import('./routeDetails/route_1251')).routeDetails;

    case "1252":
      return (await import('./routeDetails/route_1252')).routeDetails;

    case "1253":
      return (await import('./routeDetails/route_1253')).routeDetails;

    case "1254":
      return (await import('./routeDetails/route_1254')).routeDetails;

    case "2734":
      return (await import('./routeDetails/route_2734')).routeDetails;

    case "2635":
      return (await import('./routeDetails/route_2635')).routeDetails;

    case "2634":
      return (await import('./routeDetails/route_2634')).routeDetails;

    case "2691":
      return (await import('./routeDetails/route_2691')).routeDetails;

    case "2692":
      return (await import('./routeDetails/route_2692')).routeDetails;

    case "2693":
      return (await import('./routeDetails/route_2693')).routeDetails;

    case "2694":
      return (await import('./routeDetails/route_2694')).routeDetails;

    case "2695":
      return (await import('./routeDetails/route_2695')).routeDetails;

    case "2696":
      return (await import('./routeDetails/route_2696')).routeDetails;

    case "2690":
      return (await import('./routeDetails/route_2690')).routeDetails;

    case "2593":
      return (await import('./routeDetails/route_2593')).routeDetails;

    case "2518":
      return (await import('./routeDetails/route_2518')).routeDetails;

    case "2519":
      return (await import('./routeDetails/route_2519')).routeDetails;

    case "1405":
      return (await import('./routeDetails/route_1405')).routeDetails;

    case "3024":
      return (await import('./routeDetails/route_3024')).routeDetails;

    case "3025":
      return (await import('./routeDetails/route_3025')).routeDetails;

    case "1471":
      return (await import('./routeDetails/route_1471')).routeDetails;

    case "2589":
      return (await import('./routeDetails/route_2589')).routeDetails;

    case "2590":
      return (await import('./routeDetails/route_2590')).routeDetails;

    case "2592":
      return (await import('./routeDetails/route_2592')).routeDetails;

    case "913":
      return (await import('./routeDetails/route_913')).routeDetails;

    case "793":
      return (await import('./routeDetails/route_793')).routeDetails;

    case "794":
      return (await import('./routeDetails/route_794')).routeDetails;

    case "2826":
      return (await import('./routeDetails/route_2826')).routeDetails;

    case "491":
      return (await import('./routeDetails/route_491')).routeDetails;

    case "748":
      return (await import('./routeDetails/route_748')).routeDetails;

    case "3014":
      return (await import('./routeDetails/route_3014')).routeDetails;

    case "3015":
      return (await import('./routeDetails/route_3015')).routeDetails;

    case "2840":
      return (await import('./routeDetails/route_2840')).routeDetails;

    case "552":
      return (await import('./routeDetails/route_552')).routeDetails;

    case "553":
      return (await import('./routeDetails/route_553')).routeDetails;

    case "1217":
      return (await import('./routeDetails/route_1217')).routeDetails;

    case "688":
      return (await import('./routeDetails/route_688')).routeDetails;

    case "2752":
      return (await import('./routeDetails/route_2752')).routeDetails;

    case "3915":
      return (await import('./routeDetails/route_3915')).routeDetails;

    case "562":
      return (await import('./routeDetails/route_562')).routeDetails;

    case "563":
      return (await import('./routeDetails/route_563')).routeDetails;

    case "914":
      return (await import('./routeDetails/route_914')).routeDetails;

    case "492":
      return (await import('./routeDetails/route_492')).routeDetails;

    case "2841":
      return (await import('./routeDetails/route_2841')).routeDetails;

    case "2842":
      return (await import('./routeDetails/route_2842')).routeDetails;

    case "795":
      return (await import('./routeDetails/route_795')).routeDetails;

    case "796":
      return (await import('./routeDetails/route_796')).routeDetails;

    case "797":
      return (await import('./routeDetails/route_797')).routeDetails;

    case "798":
      return (await import('./routeDetails/route_798')).routeDetails;

    case "2637":
      return (await import('./routeDetails/route_2637')).routeDetails;

    case "1495":
      return (await import('./routeDetails/route_1495')).routeDetails;

    case "1496":
      return (await import('./routeDetails/route_1496')).routeDetails;

    case "1497":
      return (await import('./routeDetails/route_1497')).routeDetails;

    case "1498":
      return (await import('./routeDetails/route_1498')).routeDetails;

    case "687":
      return (await import('./routeDetails/route_687')).routeDetails;

    case "1472":
      return (await import('./routeDetails/route_1472')).routeDetails;

    case "1473":
      return (await import('./routeDetails/route_1473')).routeDetails;

    case "1474":
      return (await import('./routeDetails/route_1474')).routeDetails;

    case "1475":
      return (await import('./routeDetails/route_1475')).routeDetails;

    case "1476":
      return (await import('./routeDetails/route_1476')).routeDetails;

    case "1477":
      return (await import('./routeDetails/route_1477')).routeDetails;

    case "1478":
      return (await import('./routeDetails/route_1478')).routeDetails;

    case "1479":
      return (await import('./routeDetails/route_1479')).routeDetails;

    case "1480":
      return (await import('./routeDetails/route_1480')).routeDetails;

    case "1481":
      return (await import('./routeDetails/route_1481')).routeDetails;

    case "1482":
      return (await import('./routeDetails/route_1482')).routeDetails;

    case "2572":
      return (await import('./routeDetails/route_2572')).routeDetails;

    case "2573":
      return (await import('./routeDetails/route_2573')).routeDetails;

    case "2574":
      return (await import('./routeDetails/route_2574')).routeDetails;

    case "2575":
      return (await import('./routeDetails/route_2575')).routeDetails;

    case "2576":
      return (await import('./routeDetails/route_2576')).routeDetails;

    case "2577":
      return (await import('./routeDetails/route_2577')).routeDetails;

    case "2578":
      return (await import('./routeDetails/route_2578')).routeDetails;

    case "2579":
      return (await import('./routeDetails/route_2579')).routeDetails;

    case "2580":
      return (await import('./routeDetails/route_2580')).routeDetails;

    case "2581":
      return (await import('./routeDetails/route_2581')).routeDetails;

    case "2582":
      return (await import('./routeDetails/route_2582')).routeDetails;

    case "2583":
      return (await import('./routeDetails/route_2583')).routeDetails;

    case "2584":
      return (await import('./routeDetails/route_2584')).routeDetails;

    case "2585":
      return (await import('./routeDetails/route_2585')).routeDetails;

    case "2586":
      return (await import('./routeDetails/route_2586')).routeDetails;

    case "3782":
      return (await import('./routeDetails/route_3782')).routeDetails;

    case "4167":
      return (await import('./routeDetails/route_4167')).routeDetails;

    case "4168":
      return (await import('./routeDetails/route_4168')).routeDetails;

    case "4169":
      return (await import('./routeDetails/route_4169')).routeDetails;

    case "4170":
      return (await import('./routeDetails/route_4170')).routeDetails;

    case "4171":
      return (await import('./routeDetails/route_4171')).routeDetails;

    case "4172":
      return (await import('./routeDetails/route_4172')).routeDetails;

    case "4173":
      return (await import('./routeDetails/route_4173')).routeDetails;

    case "4174":
      return (await import('./routeDetails/route_4174')).routeDetails;

    case "4175":
      return (await import('./routeDetails/route_4175')).routeDetails;

    case "4176":
      return (await import('./routeDetails/route_4176')).routeDetails;

    case "4690":
      return (await import('./routeDetails/route_4690')).routeDetails;

    case "4691":
      return (await import('./routeDetails/route_4691')).routeDetails;

    case "4692":
      return (await import('./routeDetails/route_4692')).routeDetails;

    case "749":
      return (await import('./routeDetails/route_749')).routeDetails;

    case "750":
      return (await import('./routeDetails/route_750')).routeDetails;

    case "751":
      return (await import('./routeDetails/route_751')).routeDetails;

    case "752":
      return (await import('./routeDetails/route_752')).routeDetails;

    case "2851":
      return (await import('./routeDetails/route_2851')).routeDetails;

    case "2551":
      return (await import('./routeDetails/route_2551')).routeDetails;

    case "2541":
      return (await import('./routeDetails/route_2541')).routeDetails;

    case "830":
      return (await import('./routeDetails/route_830')).routeDetails;

    case "2852":
      return (await import('./routeDetails/route_2852')).routeDetails;

    case "2550":
      return (await import('./routeDetails/route_2550')).routeDetails;

    case "2552":
      return (await import('./routeDetails/route_2552')).routeDetails;

    case "726":
      return (await import('./routeDetails/route_726')).routeDetails;

    case "727":
      return (await import('./routeDetails/route_727')).routeDetails;

    case "728":
      return (await import('./routeDetails/route_728')).routeDetails;

    case "729":
      return (await import('./routeDetails/route_729')).routeDetails;

    case "3730":
      return (await import('./routeDetails/route_3730')).routeDetails;

    case "2909":
      return (await import('./routeDetails/route_2909')).routeDetails;

    case "2910":
      return (await import('./routeDetails/route_2910')).routeDetails;

    case "755":
      return (await import('./routeDetails/route_755')).routeDetails;

    case "733":
      return (await import('./routeDetails/route_733')).routeDetails;

    case "734":
      return (await import('./routeDetails/route_734')).routeDetails;

    case "735":
      return (await import('./routeDetails/route_735')).routeDetails;

    case "736":
      return (await import('./routeDetails/route_736')).routeDetails;

    case "2912":
      return (await import('./routeDetails/route_2912')).routeDetails;

    case "810":
      return (await import('./routeDetails/route_810')).routeDetails;

    case "4033":
      return (await import('./routeDetails/route_4033')).routeDetails;

    case "3731":
      return (await import('./routeDetails/route_3731')).routeDetails;

    case "3732":
      return (await import('./routeDetails/route_3732')).routeDetails;

    case "3733":
      return (await import('./routeDetails/route_3733')).routeDetails;

    case "756":
      return (await import('./routeDetails/route_756')).routeDetails;

    case "3734":
      return (await import('./routeDetails/route_3734')).routeDetails;

    case "3735":
      return (await import('./routeDetails/route_3735')).routeDetails;

    case "1866":
      return (await import('./routeDetails/route_1866')).routeDetails;

    case "1868":
      return (await import('./routeDetails/route_1868')).routeDetails;

    case "1869":
      return (await import('./routeDetails/route_1869')).routeDetails;

    case "2971":
      return (await import('./routeDetails/route_2971')).routeDetails;

    case "2972":
      return (await import('./routeDetails/route_2972')).routeDetails;

    case "2662":
      return (await import('./routeDetails/route_2662')).routeDetails;

    case "2663":
      return (await import('./routeDetails/route_2663')).routeDetails;

    case "1050":
      return (await import('./routeDetails/route_1050')).routeDetails;

    case "1114":
      return (await import('./routeDetails/route_1114')).routeDetails;

    case "1115":
      return (await import('./routeDetails/route_1115')).routeDetails;

    case "2521":
      return (await import('./routeDetails/route_2521')).routeDetails;

    case "2522":
      return (await import('./routeDetails/route_2522')).routeDetails;

    case "2523":
      return (await import('./routeDetails/route_2523')).routeDetails;

    case "2524":
      return (await import('./routeDetails/route_2524')).routeDetails;

    case "2525":
      return (await import('./routeDetails/route_2525')).routeDetails;

    case "2526":
      return (await import('./routeDetails/route_2526')).routeDetails;

    case "2527":
      return (await import('./routeDetails/route_2527')).routeDetails;

    case "2528":
      return (await import('./routeDetails/route_2528')).routeDetails;

    case "2529":
      return (await import('./routeDetails/route_2529')).routeDetails;

    case "2530":
      return (await import('./routeDetails/route_2530')).routeDetails;

    case "2531":
      return (await import('./routeDetails/route_2531')).routeDetails;

    case "2532":
      return (await import('./routeDetails/route_2532')).routeDetails;

    case "2533":
      return (await import('./routeDetails/route_2533')).routeDetails;

    case "2534":
      return (await import('./routeDetails/route_2534')).routeDetails;

    case "2535":
      return (await import('./routeDetails/route_2535')).routeDetails;

    case "2536":
      return (await import('./routeDetails/route_2536')).routeDetails;

    case "2537":
      return (await import('./routeDetails/route_2537')).routeDetails;

    case "2538":
      return (await import('./routeDetails/route_2538')).routeDetails;

    case "2520":
      return (await import('./routeDetails/route_2520')).routeDetails;

    case "2707":
      return (await import('./routeDetails/route_2707')).routeDetails;

    case "2708":
      return (await import('./routeDetails/route_2708')).routeDetails;

    case "2711":
      return (await import('./routeDetails/route_2711')).routeDetails;

    case "2712":
      return (await import('./routeDetails/route_2712')).routeDetails;

    case "2713":
      return (await import('./routeDetails/route_2713')).routeDetails;

    case "2714":
      return (await import('./routeDetails/route_2714')).routeDetails;

    case "2715":
      return (await import('./routeDetails/route_2715')).routeDetails;

    case "2716":
      return (await import('./routeDetails/route_2716')).routeDetails;

    case "2717":
      return (await import('./routeDetails/route_2717')).routeDetails;

    case "2718":
      return (await import('./routeDetails/route_2718')).routeDetails;

    case "2697":
      return (await import('./routeDetails/route_2697')).routeDetails;

    case "2698":
      return (await import('./routeDetails/route_2698')).routeDetails;

    case "2699":
      return (await import('./routeDetails/route_2699')).routeDetails;

    case "2700":
      return (await import('./routeDetails/route_2700')).routeDetails;

    case "2701":
      return (await import('./routeDetails/route_2701')).routeDetails;

    case "2702":
      return (await import('./routeDetails/route_2702')).routeDetails;

    case "2703":
      return (await import('./routeDetails/route_2703')).routeDetails;

    case "2861":
      return (await import('./routeDetails/route_2861')).routeDetails;

    case "2862":
      return (await import('./routeDetails/route_2862')).routeDetails;

    case "2863":
      return (await import('./routeDetails/route_2863')).routeDetails;

    case "2864":
      return (await import('./routeDetails/route_2864')).routeDetails;

    case "2865":
      return (await import('./routeDetails/route_2865')).routeDetails;

    case "527":
      return (await import('./routeDetails/route_527')).routeDetails;

    case "2807":
      return (await import('./routeDetails/route_2807')).routeDetails;

    case "2808":
      return (await import('./routeDetails/route_2808')).routeDetails;

    case "2809":
      return (await import('./routeDetails/route_2809')).routeDetails;

    case "2810":
      return (await import('./routeDetails/route_2810')).routeDetails;

    case "2654":
      return (await import('./routeDetails/route_2654')).routeDetails;

    case "2655":
      return (await import('./routeDetails/route_2655')).routeDetails;

    case "2656":
      return (await import('./routeDetails/route_2656')).routeDetails;

    case "2657":
      return (await import('./routeDetails/route_2657')).routeDetails;

    case "3704":
      return (await import('./routeDetails/route_3704')).routeDetails;

    case "3336":
      return (await import('./routeDetails/route_3336')).routeDetails;

    case "3337":
      return (await import('./routeDetails/route_3337')).routeDetails;

    case "3338":
      return (await import('./routeDetails/route_3338')).routeDetails;

    case "3339":
      return (await import('./routeDetails/route_3339')).routeDetails;

    case "3340":
      return (await import('./routeDetails/route_3340')).routeDetails;

    case "3342":
      return (await import('./routeDetails/route_3342')).routeDetails;

    case "2944":
      return (await import('./routeDetails/route_2944')).routeDetails;

    case "2946":
      return (await import('./routeDetails/route_2946')).routeDetails;

    case "2948":
      return (await import('./routeDetails/route_2948')).routeDetails;

    case "2949":
      return (await import('./routeDetails/route_2949')).routeDetails;

    case "2947":
      return (await import('./routeDetails/route_2947')).routeDetails;

    case "2945":
      return (await import('./routeDetails/route_2945')).routeDetails;

    case "2674":
      return (await import('./routeDetails/route_2674')).routeDetails;

    case "2675":
      return (await import('./routeDetails/route_2675')).routeDetails;

    case "2680":
      return (await import('./routeDetails/route_2680')).routeDetails;

    case "2681":
      return (await import('./routeDetails/route_2681')).routeDetails;

    case "2682":
      return (await import('./routeDetails/route_2682')).routeDetails;

    case "2683":
      return (await import('./routeDetails/route_2683')).routeDetails;

    case "2726":
      return (await import('./routeDetails/route_2726')).routeDetails;

    case "2727":
      return (await import('./routeDetails/route_2727')).routeDetails;

    case "2789":
      return (await import('./routeDetails/route_2789')).routeDetails;

    case "2790":
      return (await import('./routeDetails/route_2790')).routeDetails;

    case "2791":
      return (await import('./routeDetails/route_2791')).routeDetails;

    case "2544":
      return (await import('./routeDetails/route_2544')).routeDetails;

    case "2545":
      return (await import('./routeDetails/route_2545')).routeDetails;

    case "2546":
      return (await import('./routeDetails/route_2546')).routeDetails;

    case "2547":
      return (await import('./routeDetails/route_2547')).routeDetails;

    case "2796":
      return (await import('./routeDetails/route_2796')).routeDetails;

    case "2792":
      return (await import('./routeDetails/route_2792')).routeDetails;

    case "2793":
      return (await import('./routeDetails/route_2793')).routeDetails;

    case "2794":
      return (await import('./routeDetails/route_2794')).routeDetails;

    case "2795":
      return (await import('./routeDetails/route_2795')).routeDetails;

    case "3016":
      return (await import('./routeDetails/route_3016')).routeDetails;

    case "3017":
      return (await import('./routeDetails/route_3017')).routeDetails;

    case "3018":
      return (await import('./routeDetails/route_3018')).routeDetails;

    case "3019":
      return (await import('./routeDetails/route_3019')).routeDetails;

    case "3020":
      return (await import('./routeDetails/route_3020')).routeDetails;

    case "3021":
      return (await import('./routeDetails/route_3021')).routeDetails;

    default:
      return null;
  }
}
