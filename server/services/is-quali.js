const isQuali = async (req, field, docCount) => {

    const QUALI_THRES = 0.15; //req.server.config().get('omar.qualitativeThreshold.value');

    const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('data');

    let isQuali = false

    try {
        const tmpModalities = await callWithRequest(req, 'search', {
            index: req.params.index,
            body: {
                size: 0,
                aggs: {
                    type_count: {
                        cardinality: {
                            field: field
                        }
                    }
                }
            }
        })

        const numberOfModalities = tmpModalities.aggregations.type_count.value;

        if (docCount >= 700 / QUALI_THRES) {
            numberOfModalities <= 700 - 1 ? isQuali = true : isQuali = false;
        }
        else {
            numberOfModalities / docCount <= QUALI_THRES ? isQuali = true : isQuali = false;
        }
    }
    catch (e) {
        console.log('Too high number of buckets' + ' (' + field + ')')
        isQuali = false;
    }
    return isQuali;
}

export { isQuali };