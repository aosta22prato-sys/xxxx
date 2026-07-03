# Playbook Registry (最佳对冲经验法则库)

## Playbook: 快时尚春装突发尾货快速对冲促销量 (Fashion Spring Markdown Counter)
- **剧本编码**: `pb_fashion_discounter`
- **适用行业**: `Fashion (服装系统)`
- **核心触发器**: 气温突升且特定SKU库存挤压超过25天
- **决策动作**: 
  1. 定向下调价格15%
  2. 启动特定邮件挽回流失客户
- **预期置信**: 94%
- **最后运行**: 2026-06-09 10:22 [ACTIVE]

## Playbook: 餐饮连带菜品恶劣阴雨天气精准外卖弹窗 (Restaurant Bad Weather Delivery)
- **剧本编码**: `pb_restaurant_weather_p`
- **适用行业**: `Restaurant (餐饮连锁系统)`
- **核心触发器**: 降雨量 > 15mm 且当地气温突降 > 5℃
- **决策动作**: 
  1. 热更新特定暖胃汤品为推荐Top1
  2. 派发外卖专享免配券
- **预期置信**: 89%
- **最后运行**: 2026-06-10 11:05 [ACTIVE]

## Playbook: 高客单零售意向买家弃单实时AI多通路挽留 (Cart Abandonment Multi-Channel)
- **剧本编码**: `pb_retail_cart_abandon`
- **适用行业**: `Retail (零售电商系统)`
- **核心触发器**: 购物车商品金额 > 200欧元 且 流失时间 > 2小时
- **决策动作**: 
  1. AI提取商品痛点及疑问
  2. 生成5欧元个性化礼遇券对冲
- **预期置信**: 95%
- **最后运行**: 2026-06-10 16:45 [ACTIVE]
