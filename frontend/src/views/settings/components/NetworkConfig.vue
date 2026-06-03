<!-- 网络配置 -->
<template>
  <div class="network-config">
    <div class="section-title">WAN配置</div>
    
    <div class="form-list">
      <!-- WAN Type with Dropdown -->
      <div 
        class="form-item"
        :class="{ focused: isActive && focusIndex === 0 }"
      >
        <span class="label">WAN类型</span>
        <div class="value-with-icon">
          <span class="value">{{ wanType }}</span>
          <img :src="activeDropdown === 'wan' ? IconCollapse : IconDropdown" class="action-icon" />
        </div>
        
        <!-- Dropdown Popup -->
        <div class="dropdown" v-if="activeDropdown === 'wan'">
          <div 
            v-for="(opt, idx) in wanOptions" 
            :key="opt"
            class="dropdown-item"
            :class="{ selected: wanType === opt, focused: popupIndex === idx }"
          >
            {{ opt }}
            <span v-if="wanType === opt" class="check">✓</span>
          </div>
        </div>
      </div>
      
      <template v-if="isEthernet">
        <div class="form-item" :class="{ focused: isActive && focusIndex === 1 }">
          <span class="label">IP地址</span>
          <div class="value-with-icon">
            <span class="value">{{ ipAddress }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        <div class="form-item" :class="{ focused: isActive && focusIndex === 2 }">
          <span class="label">子网掩码</span>
          <div class="value-with-icon">
            <span class="value">{{ subnetMask }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        <div class="form-item" :class="{ focused: isActive && focusIndex === 3 }">
          <span class="label">网关地址</span>
          <div class="value-with-icon">
            <span class="value">{{ gateway }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        <div class="form-item" :class="{ focused: isActive && focusIndex === 4 }">
          <span class="label">DNS服务</span>
          <div class="value-with-icon">
            <span class="value">{{ dns }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        <div class="form-item" :class="{ focused: isActive && focusIndex === 5 }">
          <span class="label">通讯状态</span>
          <div class="value-with-icon">
            <span class="value">已断开</span>
            <img :src="IconRetry" class="action-icon" />
          </div>
        </div>
      </template>
      <template v-else-if="is5G">
        <div class="form-item" :class="{ focused: isActive && focusIndex === 1 }">
          <span class="label">APN</span>
          <div class="value-with-icon">
            <span class="value">{{ apnType }}</span>
            <img :src="activeDropdown === 'apn' ? IconCollapse : IconDropdown" class="action-icon" />
          </div>
          <div class="dropdown" v-if="activeDropdown === 'apn'">
            <div 
              v-for="(opt, idx) in apnOptions" 
              :key="opt"
              class="dropdown-item"
              :class="{ selected: apnType === opt, focused: popupIndex === idx }"
            >
              {{ opt }}
              <span v-if="apnType === opt" class="check">✓</span>
            </div>
          </div>
        </div>
        
        <div class="form-item" :class="{ focused: isActive && focusIndex === 2 }">
          <span class="label">拨号号码</span>
          <div class="value-with-icon">
            <span class="value">{{ dialNumber }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        
        <div class="form-item" :class="{ focused: isActive && focusIndex === 3 }">
          <span class="label">用户名</span>
          <div class="value-with-icon">
            <span class="value">{{ username }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        
        <div class="form-item" :class="{ focused: isActive && focusIndex === 4 }">
          <span class="label">密码</span>
          <div class="value-with-icon">
            <span class="value">{{ password }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        
        <div class="form-item" :class="{ focused: isActive && focusIndex === 5 }">
          <span class="label">认证方式</span>
          <div class="value-with-icon">
            <span class="value">{{ authType }}</span>
            <img :src="activeDropdown === 'auth' ? IconCollapse : IconDropdown" class="action-icon" />
          </div>
          <div class="dropdown" v-if="activeDropdown === 'auth'">
            <div 
              v-for="(opt, idx) in authOptions" 
              :key="opt"
              class="dropdown-item"
              :class="{ selected: authType === opt, focused: popupIndex === idx }"
            >
              {{ opt }}
              <span v-if="authType === opt" class="check">✓</span>
            </div>
          </div>
        </div>
        
        <div class="form-item" :class="{ focused: isActive && focusIndex === 6 }">
          <span class="label">网络协议</span>
          <div class="value-with-icon">
            <span class="value">{{ networkProtocol }}</span>
            <img :src="activeDropdown === 'protocol' ? IconCollapse : IconDropdown" class="action-icon" />
          </div>
          <div class="dropdown" v-if="activeDropdown === 'protocol'">
            <div 
              v-for="(opt, idx) in protocolOptions" 
              :key="opt"
              class="dropdown-item"
              :class="{ selected: networkProtocol === opt, focused: popupIndex === idx }"
            >
              {{ opt }}
              <span v-if="networkProtocol === opt" class="check">✓</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="isWifi">
        <div class="form-item" :class="{ focused: isActive && focusIndex === 1 }">
          <template v-if="connectedWifi">
            <div class="wifi-item-left" style="margin-left: 0;">
              <img :src="IconWifi" class="wifi-icon" />
              <div class="wifi-details">
                <div class="ssid">{{ connectedWifi.ssid }}</div>
                <div class="status">已连接</div>
              </div>
            </div>
          </template>
          <template v-else>
            <span class="label">选择可用网络</span>
          </template>
          <div class="value-with-icon">
            <img :src="activeDropdown === 'wifi' ? IconCollapse : IconDropdown" class="action-icon" />
          </div>

          <!-- WIFI Dropdown Popup -->
          <div class="dropdown wifi-dropdown" v-if="activeDropdown === 'wifi'">
            <div 
              v-for="(wifi, idx) in wifiList" 
              :key="idx"
              class="wifi-item"
              :class="{ focused: popupIndex === idx }"
            >
              <div class="wifi-item-main">
                <div class="wifi-item-left">
                  <img :src="IconWifi" class="wifi-icon" />
                  <div class="wifi-details">
                    <div class="ssid">{{ wifi.ssid }}</div>
                    <div class="status">{{ wifi.ssid === connectedWifi?.ssid ? '已连接' : wifi.status }}</div>
                  </div>
                </div>
                <div class="wifi-item-right" v-if="popupIndex === idx && !isConnectingWifi">
                  <div class="btn-action">{{ wifi.ssid === connectedWifi?.ssid ? '断开连接' : '连接' }}</div>
                </div>
              </div>
              <div class="wifi-item-connect" v-if="popupIndex === idx && isConnectingWifi">
                <div class="password-input" :class="{ focused: wifiFocusArea === 'input' }">{{ wifiPasswordInput || '请输入密码' }}</div>
                <div class="btn-confirm" :class="{ focused: wifiFocusArea === 'confirm' }">确定</div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-item" :class="{ focused: isActive && focusIndex === 2 }">
          <span class="label">IP分配</span>
          <div class="value-with-icon">
            <span class="value">{{ ipAllocation }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
        <div class="form-item" :class="{ focused: isActive && focusIndex === 3 }">
          <span class="label">DNS服务器分配</span>
          <div class="value-with-icon">
            <span class="value">{{ dnsAllocation }}</span>
            <img :src="IconEdit" class="action-icon" />
          </div>
        </div>
      </template>
    </div>
    
    <div class="section-title mt">无线配置</div>
    <div class="form-list">
      <div class="form-item" :class="{ focused: isActive && focusIndex === (isEthernet ? 6 : (is5G ? 7 : 4)) }">
        <span class="label">无线网络1_ID</span>
        <div class="value-with-icon">
          <span class="value">1</span>
        </div>
      </div>
      <div class="form-item" :class="{ focused: isActive && focusIndex === (isEthernet ? 7 : (is5G ? 8 : 5)) }">
        <span class="label">无线网络2_ID</span>
        <div class="value-with-icon">
          <span class="value">2</span>
        </div>
      </div>
    </div>

    <VirtualKeyboard 
      ref="vkbRef"
      :is-active="isKeyboardOpen"
      @input="handleKeyboardInput"
      @backspace="handleKeyboardBackspace"
      @close="handleKeyboardClose"
    />

    <!-- Network Modal (IP / DNS) -->
    <div class="modal-overlay" v-if="activeModal === 'ip' || activeModal === 'dns'">
      <div class="modal-content large-modal">
        <div class="modal-header">{{ activeModal === 'ip' ? 'IP分配' : 'DNS服务器分配' }}</div>
        <div class="modal-body grid-body">
          <!-- IP Modal -->
          <template v-if="activeModal === 'ip'">
            <!-- Row 1 -->
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 0 }">
              <span class="label">IP分配</span>
              <div class="input-box">
                <span class="value">{{ tempIpAllocation }}</span>
                <img :src="activeDropdown === 'modal_ip_alloc' ? IconCollapse : IconDropdown" class="action-icon" />
              </div>
              <div class="dropdown" v-if="activeDropdown === 'modal_ip_alloc'">
                <div 
                  v-for="(opt, idx) in ipAllocationOptions" 
                  :key="opt"
                  class="dropdown-item"
                  :class="{ selected: tempIpAllocation === opt, focused: popupIndex === idx }"
                >
                  {{ opt }}
                </div>
              </div>
            </div>
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 1 }">
              <span class="label">IP地址</span>
              <div class="input-box">
                <span class="value placeholder" v-if="!tempIpAddress">请输入</span>
                <span class="value" v-else>{{ tempIpAddress }}</span>
              </div>
            </div>
            <!-- Row 2 -->
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 2 }">
              <span class="label">子网掩码</span>
              <div class="input-box">
                <span class="value placeholder" v-if="!tempSubnet">请输入</span>
                <span class="value" v-else>{{ tempSubnet }}</span>
              </div>
            </div>
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 3 }">
              <span class="label">网关</span>
              <div class="input-box">
                <span class="value placeholder" v-if="!tempGateway">请输入</span>
                <span class="value" v-else>{{ tempGateway }}</span>
              </div>
            </div>
            <!-- Row 3 -->
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 4 }">
              <span class="label">首选DNS</span>
              <div class="input-box">
                <span class="value placeholder" v-if="!tempPrimaryDns">请输入</span>
                <span class="value" v-else>{{ tempPrimaryDns }}</span>
              </div>
            </div>
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 5 }">
              <span class="label">DNS over HTTPS</span>
              <div class="input-box">
                <span class="value">{{ tempPrimaryDoh }}</span>
                <img :src="activeDropdown === 'modal_pri_doh' ? IconCollapse : IconDropdown" class="action-icon" />
              </div>
              <div class="dropdown" v-if="activeDropdown === 'modal_pri_doh'">
                <div 
                  v-for="(opt, idx) in dohOptions" 
                  :key="opt"
                  class="dropdown-item"
                  :class="{ selected: tempPrimaryDoh === opt, focused: popupIndex === idx }"
                >
                  {{ opt }}
                </div>
              </div>
            </div>
            <!-- Row 4 -->
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 6 }">
              <span class="label">备用DNS</span>
              <div class="input-box">
                <span class="value placeholder" v-if="!tempSecondaryDns">请输入</span>
                <span class="value" v-else>{{ tempSecondaryDns }}</span>
              </div>
            </div>
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 7 }">
              <span class="label">DNS over HTTPS</span>
              <div class="input-box">
                <span class="value">{{ tempSecondaryDoh }}</span>
                <img :src="activeDropdown === 'modal_sec_doh' ? IconCollapse : IconDropdown" class="action-icon" />
              </div>
              <div class="dropdown" v-if="activeDropdown === 'modal_sec_doh'">
                <div 
                  v-for="(opt, idx) in dohOptions" 
                  :key="opt"
                  class="dropdown-item"
                  :class="{ selected: tempSecondaryDoh === opt, focused: popupIndex === idx }"
                >
                  {{ opt }}
                </div>
              </div>
            </div>
          </template>

          <!-- DNS Modal -->
          <template v-if="activeModal === 'dns'">
            <!-- Row 1 -->
            <div class="form-item-col full-width" :class="{ focused: modalFocusIndex === 0 }">
              <span class="label">DNS服务器分配</span>
              <div class="input-box">
                <span class="value">{{ tempDnsAllocation }}</span>
                <img :src="activeDropdown === 'modal_dns_alloc' ? IconCollapse : IconDropdown" class="action-icon" />
              </div>
              <div class="dropdown" v-if="activeDropdown === 'modal_dns_alloc'">
                <div 
                  v-for="(opt, idx) in dnsAllocationOptions" 
                  :key="opt"
                  class="dropdown-item"
                  :class="{ selected: tempDnsAllocation === opt, focused: popupIndex === idx }"
                >
                  {{ opt }}
                </div>
              </div>
            </div>
            <!-- Row 2 -->
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 1 }">
              <span class="label">首选DNS</span>
              <div class="input-box">
                <span class="value placeholder" v-if="!tempDnsPrimaryDns">请输入</span>
                <span class="value" v-else>{{ tempDnsPrimaryDns }}</span>
              </div>
            </div>
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 2 }">
              <span class="label">DNS over HTTPS</span>
              <div class="input-box">
                <span class="value">{{ tempDnsPrimaryDoh }}</span>
                <img :src="activeDropdown === 'modal_dns_pri_doh' ? IconCollapse : IconDropdown" class="action-icon" />
              </div>
              <div class="dropdown" v-if="activeDropdown === 'modal_dns_pri_doh'">
                <div 
                  v-for="(opt, idx) in dohOptions" 
                  :key="opt"
                  class="dropdown-item"
                  :class="{ selected: tempDnsPrimaryDoh === opt, focused: popupIndex === idx }"
                >
                  {{ opt }}
                </div>
              </div>
            </div>
            <!-- Row 3 -->
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 3 }">
              <span class="label">备用DNS</span>
              <div class="input-box">
                <span class="value placeholder" v-if="!tempDnsSecondaryDns">请输入</span>
                <span class="value" v-else>{{ tempDnsSecondaryDns }}</span>
              </div>
            </div>
            <div class="form-item-col" :class="{ focused: modalFocusIndex === 4 }">
              <span class="label">DNS over HTTPS</span>
              <div class="input-box">
                <span class="value">{{ tempDnsSecondaryDoh }}</span>
                <img :src="activeDropdown === 'modal_dns_sec_doh' ? IconCollapse : IconDropdown" class="action-icon" />
              </div>
              <div class="dropdown" v-if="activeDropdown === 'modal_dns_sec_doh'">
                <div 
                  v-for="(opt, idx) in dohOptions" 
                  :key="opt"
                  class="dropdown-item"
                  :class="{ selected: tempDnsSecondaryDoh === opt, focused: popupIndex === idx }"
                >
                  {{ opt }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <div class="btn" :class="{ focused: (activeModal === 'ip' && modalFocusIndex === 8) || (activeModal === 'dns' && modalFocusIndex === 5) }">取消</div>
          <div class="btn primary" :class="{ focused: (activeModal === 'ip' && modalFocusIndex === 9) || (activeModal === 'dns' && modalFocusIndex === 6) }">保存</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, watch } from 'vue'
import IconCollapse from '../../../assets/img/iocn-collapse.png'
import IconDropdown from '../../../assets/img/icon-dropdown.png'
import IconEdit from '../../../assets/img/icon-edit.png'
import IconDetails from '../../../assets/img/iocn-details.png'
import IconRetry from '../../../assets/img/icon-retry.png'
import IconWifi from '../../../assets/img/icon-wifi.png'
import VirtualKeyboard from '../../components/VirtualKeyboard.vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['popup-open', 'popup-close', 'back'])
const activeZone = inject('activeZone') as any

const focusIndex = ref(0)
const wanType = ref('以太网')
const wanOptions = ['WIFI', '5G', '以太网']
const isDropdownOpen = ref(false)
const activeDropdown = ref('') // 'wan', 'apn', 'auth', 'protocol', 'freq', 'channel'
const popupIndex = ref(0)

const isEthernet = computed(() => wanType.value === '以太网')
const is5G = computed(() => wanType.value === '5G')
const isWifi = computed(() => wanType.value === 'WIFI')

// WIFI Form values
const ipAllocation = ref('自动 (DHCP)')
const dnsAllocation = ref('手动')
const connectedWifi = ref<any>(null)
const wifiList = ref([
  { ssid: 'CSWLLJ', status: '安全' },
  { ssid: 'CSWLLJ-DR', status: '安全' },
  { ssid: 'CSWLLJ-DS', status: '安全' },
  { ssid: 'CSWLLJ-DS2', status: '安全' }
])
const isConnectingWifi = ref(false)
const wifiPasswordInput = ref('')
const wifiFocusArea = ref('input') // 'input', 'confirm'

// Ethernet Form values
const ipAddress = ref('192.168.10.10:8000')
const subnetMask = ref('172.16.66.145')
const gateway = ref('172.16.66.216: 8091')
const dns = ref('192.168.10.10:8000')

// 5G Form values
const apnType = ref('专网')
const apnOptions = ['专网', '公网']
const dialNumber = ref('15565857882')
const username = ref('张晓')
const password = ref('66668888')
const authType = ref('专网')
const authOptions = ['专网', 'CHAP', 'PAP']
const networkProtocol = ref('ipv4')
const protocolOptions = ['ipv4', 'ipv6', 'ipv4/ipv6']

const activeModal = ref('') // 'ip', 'dns'
const modalFocusIndex = ref(0)

const ipAllocationOptions = ['手动', '自动 (DHCP)']
const dohOptions = ['关', '开']
const dnsAllocationOptions = ['手动', '自动']

const tempIpAllocation = ref('手动')
const tempIpAddress = ref('')
const tempSubnet = ref('')
const tempGateway = ref('')
const tempPrimaryDns = ref('')
const tempPrimaryDoh = ref('关')
const tempSecondaryDns = ref('')
const tempSecondaryDoh = ref('关')

const tempDnsAllocation = ref('手动')
const tempDnsPrimaryDns = ref('')
const tempDnsPrimaryDoh = ref('关')
const tempDnsSecondaryDns = ref('')
const tempDnsSecondaryDoh = ref('关')


const totalItems = computed(() => {
  if (isEthernet.value) return 8
  if (is5G.value) return 9 // WAN(1) + 5G(6) + Wireless(2)
  return 6 // WIFI: WAN(1) + Wifi(1) + IP(1) + DNS(1) + Wireless(2)
})

// Keyboard logic
const isKeyboardOpen = ref(false)
const activeInput = ref(-1) // 1: IP, 2: 子网, 3: 网关, 4: DNS (for Ethernet) OR 2: dial, 3: user, 4: pass (for 5G)
const vkbRef = ref<any>(null)

const handleKeyboardInput = (char: string) => {
  if (activeInput.value === 99) {
    wifiPasswordInput.value += char
    return
  }
  if (activeInput.value === 10) tempIpAddress.value += char
  else if (activeInput.value === 11) tempSubnet.value += char
  else if (activeInput.value === 12) tempGateway.value += char
  else if (activeInput.value === 13) tempPrimaryDns.value += char
  else if (activeInput.value === 14) tempSecondaryDns.value += char
  else if (activeInput.value === 20) tempDnsPrimaryDns.value += char
  else if (activeInput.value === 21) tempDnsSecondaryDns.value += char
  else if (isEthernet.value) {
    if (activeInput.value === 1) ipAddress.value += char
    else if (activeInput.value === 2) subnetMask.value += char
    else if (activeInput.value === 3) gateway.value += char
    else if (activeInput.value === 4) dns.value += char
  } else if (is5G.value) {
    if (activeInput.value === 2) dialNumber.value += char
    else if (activeInput.value === 3) username.value += char
    else if (activeInput.value === 4) password.value += char
  }
}

const handleKeyboardBackspace = () => {
  if (activeInput.value === 99) {
    wifiPasswordInput.value = wifiPasswordInput.value.slice(0, -1)
    return
  }
  if (activeInput.value === 10) tempIpAddress.value = tempIpAddress.value.slice(0, -1)
  else if (activeInput.value === 11) tempSubnet.value = tempSubnet.value.slice(0, -1)
  else if (activeInput.value === 12) tempGateway.value = tempGateway.value.slice(0, -1)
  else if (activeInput.value === 13) tempPrimaryDns.value = tempPrimaryDns.value.slice(0, -1)
  else if (activeInput.value === 14) tempSecondaryDns.value = tempSecondaryDns.value.slice(0, -1)
  else if (activeInput.value === 20) tempDnsPrimaryDns.value = tempDnsPrimaryDns.value.slice(0, -1)
  else if (activeInput.value === 21) tempDnsSecondaryDns.value = tempDnsSecondaryDns.value.slice(0, -1)
  else if (isEthernet.value) {
    if (activeInput.value === 1) ipAddress.value = ipAddress.value.slice(0, -1)
    else if (activeInput.value === 2) subnetMask.value = subnetMask.value.slice(0, -1)
    else if (activeInput.value === 3) gateway.value = gateway.value.slice(0, -1)
    else if (activeInput.value === 4) dns.value = dns.value.slice(0, -1)
  } else if (is5G.value) {
    if (activeInput.value === 2) dialNumber.value = dialNumber.value.slice(0, -1)
    else if (activeInput.value === 3) username.value = username.value.slice(0, -1)
    else if (activeInput.value === 4) password.value = password.value.slice(0, -1)
  }
}

const handleKeyboardClose = () => {
  isKeyboardOpen.value = false
  if (activeInput.value === 99) {
    // Return focus to wifi input block without emitting popup-close
    wifiFocusArea.value = 'input'
    return
  }
  if (activeInput.value >= 10 && activeInput.value <= 21) {
    return
  }
  emit('popup-close')
}

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    focusIndex.value = 0
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive && activeZone?.value !== 'popup') return
  
  if (isKeyboardOpen.value) {
    if (vkbRef.value) {
      vkbRef.value.handleKeyDown(e)
    }
    return
  }

  if (activeZone?.value === 'popup') {
    if (isDropdownOpen.value) {
      const getOptions = () => {
        if (activeDropdown.value === 'wan') return wanOptions
        if (activeDropdown.value === 'apn') return apnOptions
        if (activeDropdown.value === 'auth') return authOptions
        if (activeDropdown.value === 'protocol') return protocolOptions
        if (activeDropdown.value === 'wifi') return wifiList.value
        if (activeDropdown.value === 'modal_ip_alloc') return ipAllocationOptions
        if (activeDropdown.value === 'modal_pri_doh' || activeDropdown.value === 'modal_sec_doh' || activeDropdown.value === 'modal_dns_pri_doh' || activeDropdown.value === 'modal_dns_sec_doh') return dohOptions
        if (activeDropdown.value === 'modal_dns_alloc') return dnsAllocationOptions
        return []
      }
      const opts = getOptions()
      
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (activeDropdown.value === 'wifi' && isConnectingWifi.value) return
        popupIndex.value = (popupIndex.value - 1 + opts.length) % opts.length
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (activeDropdown.value === 'wifi' && isConnectingWifi.value) return
        popupIndex.value = (popupIndex.value + 1) % opts.length
      } else if (e.key === 'Enter') {
        if (activeDropdown.value === 'wan') {
          wanType.value = opts[popupIndex.value] as string
          if (!isEthernet.value && focusIndex.value > 0) {
            focusIndex.value = 0
          }
        } else if (activeDropdown.value === 'apn') apnType.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'auth') authType.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'protocol') networkProtocol.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'modal_ip_alloc') tempIpAllocation.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'modal_pri_doh') tempPrimaryDoh.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'modal_sec_doh') tempSecondaryDoh.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'modal_dns_alloc') tempDnsAllocation.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'modal_dns_pri_doh') tempDnsPrimaryDoh.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'modal_dns_sec_doh') tempDnsSecondaryDoh.value = opts[popupIndex.value] as string
        else if (activeDropdown.value === 'wifi') {
          if (isConnectingWifi.value) {
            if (wifiFocusArea.value === 'input') {
              activeInput.value = 99
              isKeyboardOpen.value = true
              emit('popup-open')
            } else if (wifiFocusArea.value === 'confirm') {
              connectedWifi.value = { ssid: wifiList.value[popupIndex.value].ssid, status: '已连接' }
              isDropdownOpen.value = false
              activeDropdown.value = ''
              isConnectingWifi.value = false
              emit('popup-close')
            }
            return
          } else {
            const selected = wifiList.value[popupIndex.value]
            if (connectedWifi.value && connectedWifi.value.ssid === selected.ssid) {
              connectedWifi.value = null
              isDropdownOpen.value = false
              activeDropdown.value = ''
              emit('popup-close')
            } else {
              isConnectingWifi.value = true
              wifiPasswordInput.value = ''
              wifiFocusArea.value = 'input'
              activeInput.value = 99
              isKeyboardOpen.value = true
              emit('popup-open')
            }
            return
          }
        }
        
        // For nested dropdowns in modals, we do NOT emit popup-close to the root because that would close the modal.
        // We only clear the dropdown state so the modal regains focus naturally.
        const currentActiveDropdown = activeDropdown.value
        isDropdownOpen.value = false
        activeDropdown.value = ''
        if (!['modal_ip_alloc', 'modal_pri_doh', 'modal_sec_doh', 'modal_dns_alloc', 'modal_dns_pri_doh', 'modal_dns_sec_doh'].includes(currentActiveDropdown)) {
          emit('popup-close')
        }
      } else if (e.key === 'Escape') {
        if (activeDropdown.value === 'wifi' && isConnectingWifi.value) {
          isConnectingWifi.value = false
          return
        }
        const currentActiveDropdown = activeDropdown.value
        isDropdownOpen.value = false
        activeDropdown.value = ''
        if (!['modal_ip_alloc', 'modal_pri_doh', 'modal_sec_doh', 'modal_dns_alloc', 'modal_dns_pri_doh', 'modal_dns_sec_doh'].includes(currentActiveDropdown)) {
          emit('popup-close')
        }
      } else if (activeDropdown.value === 'wifi' && isConnectingWifi.value) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault()
          // Toggle focus area
          wifiFocusArea.value = wifiFocusArea.value === 'input' ? 'confirm' : 'input'
        }
      }
    } else if (activeModal.value === 'ip') {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (modalFocusIndex.value >= 2 && modalFocusIndex.value <= 7) modalFocusIndex.value -= 2
        else if (modalFocusIndex.value >= 8) modalFocusIndex.value -= 2 // From buttons up to last row inputs
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (modalFocusIndex.value <= 5) modalFocusIndex.value += 2
        else if (modalFocusIndex.value === 6 || modalFocusIndex.value === 7) modalFocusIndex.value = 8 // Down to cancel btn
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (modalFocusIndex.value % 2 === 1) modalFocusIndex.value -= 1
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (modalFocusIndex.value % 2 === 0) modalFocusIndex.value += 1
      } else if (e.key === 'Enter') {
        if (modalFocusIndex.value === 0) {
          isDropdownOpen.value = true
          activeDropdown.value = 'modal_ip_alloc'
          popupIndex.value = ipAllocationOptions.indexOf(tempIpAllocation.value)
        } else if (modalFocusIndex.value === 1) {
          activeInput.value = 10
          isKeyboardOpen.value = true
        } else if (modalFocusIndex.value === 2) {
          activeInput.value = 11
          isKeyboardOpen.value = true
        } else if (modalFocusIndex.value === 3) {
          activeInput.value = 12
          isKeyboardOpen.value = true
        } else if (modalFocusIndex.value === 4) {
          activeInput.value = 13
          isKeyboardOpen.value = true
        } else if (modalFocusIndex.value === 5) {
          isDropdownOpen.value = true
          activeDropdown.value = 'modal_pri_doh'
          popupIndex.value = dohOptions.indexOf(tempPrimaryDoh.value)
        } else if (modalFocusIndex.value === 6) {
          activeInput.value = 14
          isKeyboardOpen.value = true
        } else if (modalFocusIndex.value === 7) {
          isDropdownOpen.value = true
          activeDropdown.value = 'modal_sec_doh'
          popupIndex.value = dohOptions.indexOf(tempSecondaryDoh.value)
        } else if (modalFocusIndex.value === 8) {
          activeModal.value = ''
          emit('popup-close')
        } else if (modalFocusIndex.value === 9) {
          ipAllocation.value = tempIpAllocation.value
          activeModal.value = ''
          emit('popup-close')
        }
      } else if (e.key === 'Escape') {
        activeModal.value = ''
        emit('popup-close')
      }
    } else if (activeModal.value === 'dns') {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (modalFocusIndex.value === 1 || modalFocusIndex.value === 2) modalFocusIndex.value = 0
        else if (modalFocusIndex.value === 3 || modalFocusIndex.value === 4) modalFocusIndex.value -= 2
        else if (modalFocusIndex.value === 5 || modalFocusIndex.value === 6) modalFocusIndex.value = 3 // from btns to last row
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (modalFocusIndex.value === 0) modalFocusIndex.value = 1
        else if (modalFocusIndex.value === 1 || modalFocusIndex.value === 2) modalFocusIndex.value += 2
        else if (modalFocusIndex.value === 3 || modalFocusIndex.value === 4) modalFocusIndex.value = 5 // down to btn
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (modalFocusIndex.value === 2) modalFocusIndex.value = 1
        else if (modalFocusIndex.value === 4) modalFocusIndex.value = 3
        else if (modalFocusIndex.value === 6) modalFocusIndex.value = 5
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (modalFocusIndex.value === 1) modalFocusIndex.value = 2
        else if (modalFocusIndex.value === 3) modalFocusIndex.value = 4
        else if (modalFocusIndex.value === 5) modalFocusIndex.value = 6
      } else if (e.key === 'Enter') {
        if (modalFocusIndex.value === 0) {
          isDropdownOpen.value = true
          activeDropdown.value = 'modal_dns_alloc'
          popupIndex.value = dnsAllocationOptions.indexOf(tempDnsAllocation.value)
        } else if (modalFocusIndex.value === 1) {
          activeInput.value = 20
          isKeyboardOpen.value = true
        } else if (modalFocusIndex.value === 2) {
          isDropdownOpen.value = true
          activeDropdown.value = 'modal_dns_pri_doh'
          popupIndex.value = dohOptions.indexOf(tempDnsPrimaryDoh.value)
        } else if (modalFocusIndex.value === 3) {
          activeInput.value = 21
          isKeyboardOpen.value = true
        } else if (modalFocusIndex.value === 4) {
          isDropdownOpen.value = true
          activeDropdown.value = 'modal_dns_sec_doh'
          popupIndex.value = dohOptions.indexOf(tempDnsSecondaryDoh.value)
        } else if (modalFocusIndex.value === 5) {
          activeModal.value = ''
          emit('popup-close')
        } else if (modalFocusIndex.value === 6) {
          dnsAllocation.value = tempDnsAllocation.value
          activeModal.value = ''
          emit('popup-close')
        }
      } else if (e.key === 'Escape') {
        activeModal.value = ''
        emit('popup-close')
      }
    }
  } else if (props.isActive) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusIndex.value = (focusIndex.value - 1 + totalItems.value) % totalItems.value
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusIndex.value = (focusIndex.value + 1) % totalItems.value
    } else if (e.key === 'Enter') {
      if (focusIndex.value === 0) {
        // open WAN dropdown
        isDropdownOpen.value = true
        activeDropdown.value = 'wan'
        popupIndex.value = wanOptions.indexOf(wanType.value)
        emit('popup-open')
      } else if (isWifi.value && focusIndex.value === 1) {
        isDropdownOpen.value = true
        activeDropdown.value = 'wifi'
        popupIndex.value = 0
        isConnectingWifi.value = false
        wifiPasswordInput.value = ''
        emit('popup-open')
      } else if (isWifi.value && focusIndex.value === 2) {
        activeModal.value = 'ip'
        modalFocusIndex.value = 0
        tempIpAllocation.value = ipAllocation.value
        emit('popup-open')
      } else if (isWifi.value && focusIndex.value === 3) {
        activeModal.value = 'dns'
        modalFocusIndex.value = 0
        tempDnsAllocation.value = dnsAllocation.value
        emit('popup-open')
      } else if (isEthernet.value && focusIndex.value >= 1 && focusIndex.value <= 4) {
        activeInput.value = focusIndex.value
        isKeyboardOpen.value = true
        emit('popup-open')
      } else if (is5G.value) {
        if (focusIndex.value === 1) {
          isDropdownOpen.value = true
          activeDropdown.value = 'apn'
          popupIndex.value = apnOptions.indexOf(apnType.value)
          emit('popup-open')
        } else if (focusIndex.value >= 2 && focusIndex.value <= 4) {
          activeInput.value = focusIndex.value
          isKeyboardOpen.value = true
          emit('popup-open')
        } else if (focusIndex.value === 5) {
          isDropdownOpen.value = true
          activeDropdown.value = 'auth'
          popupIndex.value = authOptions.indexOf(authType.value)
          emit('popup-open')
        } else if (focusIndex.value === 6) {
          isDropdownOpen.value = true
          activeDropdown.value = 'protocol'
          popupIndex.value = protocolOptions.indexOf(networkProtocol.value)
          emit('popup-open')
        }
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      e.preventDefault()
      emit('back')
    }
  }
}

defineExpose({ handleKeyDown })

// remove onMounted and onUnmounted
</script>

<style scoped>
.network-config {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
}

.section-title {
  font-size: 22px;
  color: #8fa0b5;
  margin-bottom: 5px;
  padding: 0 10px;
}

.mt {
  margin-top: 5px;
}

.form-list {
  background-color: #1a273b;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #2a3a52;
  position: relative;
  border: 2px solid transparent;
  min-height: 64px;
  box-sizing: border-box;
}

.form-item:last-child {
  border-bottom: 2px solid transparent;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.form-item.focused {
  border-color: #00bcd4;
  background-color: #21334d;
  z-index: 1;
}

.label {
  color: #8fa0b5;
  font-size: 22px;
}

.value-with-icon {
  display: flex;
  align-items: center;
  gap: 15px;
}

.value {
  color: #fff;
  font-size: 22px;
}

.action-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: #21334d;
  border: 1px solid #3a4a62;
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

.dropdown-item {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 22px;
}

.dropdown-item.focused {
  background-color: #3a4a62;
  color: #00bcd4;
}

.dropdown-item.selected {
  color: #00bcd4;
}

/* WIFI Dropdown Styles */
.wifi-dropdown {
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

.wifi-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid transparent;
  margin-bottom: 5px;
  background-color: transparent;
}

.wifi-item.focused {
  background-color: #2a3a52;
  border-color: #00bcd4;
  color: #fff;
}

.wifi-item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.wifi-item-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.wifi-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.wifi-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wifi-details .ssid {
  font-size: 22px;
  color: #fff;
  line-height: 1;
}

.wifi-details .status {
  font-size: 16px;
  color: #8fa0b5;
  line-height: 1;
}

.btn-action {
  padding: 8px 20px;
  border: 1px solid #00bcd4;
  border-radius: 4px;
  color: #00bcd4;
  font-size: 20px;
}

.wifi-item-connect {
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 15px;
  padding-left: 43px; /* 28 icon width + 15 gap */
}

.password-input {
  flex: 1;
  height: 44px;
  border: 1px solid #3a4a62;
  border-radius: 4px;
  background-color: #1a273b;
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #fff;
  font-size: 20px;
}

.password-input.focused {
  border-color: #00bcd4;
}

.btn-confirm {
  padding: 0 30px;
  height: 44px;
  background-color: #3a4a62;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 1px solid transparent;
}

.btn-confirm.focused {
  border-color: #00bcd4;
  background-color: #00bcd4;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 1280px;
  height: 800px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  width: 500px;
  background-color: rgba(44, 68, 90, 1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.large-modal {
  width: 640px;
}

.modal-header {
  font-size: 22px;
  color: #fff;
  text-align: center;
  padding: 20px;
  background-color: #21334d;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.modal-body {
  padding: 20px 40px;
  background-color: #1a273b;
}

.grid-body {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 15px;
  padding: 20px 30px;
  background-color: #21334d;
}

.form-item-col {
  width: calc(50% - 7.5px);
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-item-col.full-width {
  width: 100%;
}

.form-item-col .label {
  font-size: 18px;
  color: #fff;
  margin-bottom: 10px;
}

.input-box {
  width: 100%;
  height: 48px;
  background-color: #1a273b;
  border: 1px solid #3a4a62;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
}

.form-item-col.focused .input-box {
  border-color: #00bcd4;
}

.input-box .value {
  font-size: 20px;
  color: #fff;
}

.input-box .value.placeholder {
  color: #5c6d82;
}

/* Modal Dropdown overrides */
.form-item-col .dropdown {
  top: calc(100% + 5px);
  width: 100%;
}

.modal-body .form-item {
  border: 2px solid transparent;
  border-radius: 6px;
  margin-bottom: 15px;
  border-bottom: 1px solid #2a3a52;
}

.modal-body .form-item.focused {
  border-color: #00bcd4;
  background-color: #21334d;
}

.modal-footer {
  display: flex;
  height: 64px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
  background: rgba(57, 84, 109, 1);
}

.btn {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #8fa0b5;

  border: 2px solid transparent;
  cursor: pointer;
}

.btn.primary {
  /* background-color: #2a3a52; */
  color: #fff;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.focused {
  border-color: #00bcd4;
  color: #fff;
}
</style>
