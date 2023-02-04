export const generateDailyLabels =  () => { 
  const date = new Date();
  const labels = []
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      for(let i=1;i< days;i++) { 
        labels.push(i)
      }
      return labels
}

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  backgroundColor: '#7F7F7F',
  defaultFontColor: 'white',
  scales: {
    x: {
      ticks: {
        min: 1,
        callback: function(value, index, values) {
          if (value === 0) {
            return null;
          }
          return value;
        }
      },
      grid: {
        display: false
      },
      
    },
    y: {
      ticks: {
        min: 1,
        callback: function(value, index, values) {
          if (value === 0) {
            return null;
          }
          return value;
        }
      },
      grid: {
        display: false
      }
    }
  },
  plugins: {
    datalabels: {
       display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
       }
    }
  }
}

export const returnOrderDate = (order,date) => { 

}

export const generateChartData = (orders) => { 
 const labels = generateDailyLabels()
 const monthlyOrders = []
 console.log('orders', orders,labels)
  labels.forEach(label => { 
    let cc  = 0
      orders.forEach(order => { 
        const date = new Date(order['order-duration'].startAt)
        if(date.getDate() === label) {
          cc++
        }
      })
      monthlyOrders.push(cc)
  })
  return monthlyOrders
}

  
  