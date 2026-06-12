import mqtt, { MqttClient } from 'mqtt'

export interface MqttConfig {
  host: string
  port?: number
  path?: string
  topic: any
}

class MqttService {
  private client: MqttClient | null = null
  private config: MqttConfig
  public onMessage?: (topic: string, message: string) => void

  constructor(config: MqttConfig) {
    this.config = config
  }

  // 初始化连接
  public connect() {
    console.log("1111")
    // 默认使用 ws 协议在浏览器端连接 MQTT，如果是桌面端需要根据 broker 实际情况可换用 mqtt://
    const url = `ws://${this.config.host}:${this.config.port || 8083}${this.config.path || '/mqtt'}`
    
    console.log(`[MQTT] 正在连接: ${url}`)
    
    this.client = mqtt.connect(url, {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    })

    this.client.on('connect', () => {
      console.log('[MQTT] 连接成功!')
      this.subscribe()
    })

    this.client.on('error', (err) => {
      console.error('[MQTT] 连接错误:', err)
    })

    this.client.on('reconnect', () => {
      console.log('[MQTT] 正在重新连接...')
    })

    this.client.on('offline', () => {
      console.log('[MQTT] 已离线')
    })

    this.client.on('message', (topic, message) => {
      const msgStr = message.toString()
      // 当收到消息时触发，可在此分发给具体的业务逻辑
      console.log(`[MQTT] 收到主题 ${topic} 的消息:`, msgStr)
      if (this.onMessage) {
        this.onMessage(topic, msgStr)
      }
    })
  }

  // 订阅主题
  private subscribe() {
    if (!this.client) return
    
    this.client.subscribe(this.config.topic, { qos: 0 }, (err) => {
      if (!err) {
        console.log(`[MQTT] 成功订阅主题: ${this.config.topic}`)
      } else {
        console.error(`[MQTT] 订阅失败:`, err)
      }
    })
  }

  // 发送消息
  public publish(payload: string | object, qos: 0 | 1 | 2 = 0) {
    if (!this.client || !this.client.connected) {
      console.warn('[MQTT] 尚未连接，无法发送消息')
      return
    }

    const message = typeof payload === 'string' ? payload : JSON.stringify(payload)
    
    this.client.publish(this.config.topic, message, { qos }, (err) => {
      if (err) {
        console.error('[MQTT] 消息发送失败:', err)
      } else {
        console.log(`[MQTT] 消息发送成功 [${this.config.topic}]:`, message)
      }
    })
  }

  // 断开连接
  public disconnect() {
    if (this.client) {
      this.client.end()
      this.client = null
      console.log('[MQTT] 连接已断开')
    }
  }
}

export default MqttService
