var reviewHelpers = {
  swapDashWithSpace: function(str) {
    if (str) {
      return str.replace(/-/g, ' ');
    }
  },

  groupAndCount: function(curr) {
    if (curr) {
      this[curr] = (this[curr] || 0) + 1;
    }
  },

  groupAndCountWithId: function(curr) {
    var name = curr[1];

    if (!this[name])    this[name]    = {};
    if (!this[name].id) this[name].id = curr[0];

    this[name].count = (this[name].count || 0) + 1;
  },

  analyzeOrderPatterns: function(orders) {
    if (!orders.length) return;

    var itemsSold      = {};
    var paymentMethods = {};

    var revenue = orders
      .map(function(order) {
        return order.total;
      })
      .reduce(function(prev, curr) {
        return prev + curr;
      });

    var averagePayment = orders
      .map(function(order) {
        return order.payment;
      })
      .reduce(function(prev, curr) {
        return prev + curr;
      }) / orders.length;

    // items sold
    orders
      .map(function(order) {
        return order.items
          .map(function(item) {
            return [item._id, item.name];
          })
          .forEach(reviewHelpers.groupAndCountWithId, itemsSold)
      });
    itemsSold = Object.keys(itemsSold)
      .map(function(name) {
        var obj = itemsSold[name];

        return {
          name:  name,
          count: obj.count,
          id:    obj.id
        };
      })
      .sort(function(a, b) {
        return a.count < b.count;
      });

    // payment methods
    orders
      .map(function(order) {
        return order.method;
      })
      .forEach(reviewHelpers.groupAndCount, paymentMethods);

    var data = {
      quantity:       orders.length,
      revenue:        revenue,
      averagePayment: averagePayment,
      itemsSold:      itemsSold,
      paymentMethods: paymentMethods
    };

    return data;
  },

  getAggregateDateInfo: function(params) {
    var start    = params.startDate.split(' ');
    var end      = params.endDate.split(' ');
    var dateInfo = {project: {}, group: {}};
    var specificity = 'hour';

    if (parseInt(start[2]) < parseInt(end[2])) {
      specificity = 'year';
    } else if (start[1] !== end[1]) {
      specificity = 'month';
    } else if (parseInt(end[0]) > parseInt(start[0]) + 1) {
      specificity = 'dayOfMonth';
    }

    dateInfo.project[specificity] = {};
    dateInfo.project[specificity]['$' + specificity] = '$created';
    dateInfo.group[specificity] = '$' + specificity;

    return dateInfo;
  },

  getTrafficMetaInfo: function(traffic) {
    var metaInfo = {};
    var dateKey  = Object.keys(traffic[0]._id)[0];
    var counts   = traffic
      .map(function(result) {
        return result.count;
      })
      .sort(function(a, b) { return a > b; });

    metaInfo.dateRange = {
      smallest: traffic[0]._id[dateKey],
      largest : traffic[traffic.length - 1]._id[dateKey]
    };

    metaInfo.countRange = {
      smallest: counts[0],
      largest:  counts[counts.length - 1]
    };

    metaInfo.dateKey = dateKey;

    return metaInfo;
  }
};

module.exports = reviewHelpers;
