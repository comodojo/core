<?php

/**
 * i18n_installer_it.php
 * 
 * Localized (it) installer strings
 * 
 * @package		Comodojo Installer
 * @author		comodojo.org
 * @copyright	2012 comodojo.org (info@comodojo.org)
 * @version		__CURRENT_VERSION__
 * @license		GPL Version 3
 */
 
$i18n_installer = array (
	"0000"	=>	"<< precedente",
	"0001"	=>	"prosegui >>",
	"0002"	=>	"Ora che parliamo la stessa lingua, dovresti fornirmi i dettagli del tuo database.",
	"0003"	=>	"Host sul quale risiede il database",
	"0004"	=>	"Porta del database",
	"0005"	=>	"Nome del database",
	"0006"	=>	"Utente da usare per il database",
	"0007"	=>	"Password dell'utente",
	"0008"	=>	"Prefisso da usare nella creazione delle tavole",
	"0009"	=>	"Tipo di database",
	"0010"	=>	"Database sconosciuto o host non valido",
	"0011"	=>	"Utente sconosciuto o password non valida",
	"0012"	=>	"",
	"0013"	=>	"Adesso ho bisogno di avere qualche informazione di base sul portale che stai creando",
	"0014"	=>	"Titolo del portale",
	"0015"	=>	"Breve descrizione (opzionale)",
	"0016"	=>	"Nome dell'autore del portale",
	"0017"	=>	"Localizzazione di default (se scegli 'auto' adatterò dinamicamente la localizzazione in base al browser)",
	"0018"	=>	"",
	"0019"	=>	"",
	"0020"	=>	"",
	"0021"	=>	"",
	"0022"	=>	"Impostazioni specifiche javascript (dojotoolkit)",
	"0023"	=>	"Tema di base",
	"0024"	=>	"Abilita il caricamento delle risorse in modalità cross domain",
	"0025"	=>	"Timeout per il caricamento cross domain",
	"0026"	=>	"Abilita debug javascript (firebug)",
	"0027"	=>	"Apri firebug in una finestra separata (popup)",
	"0028"	=>	"Abilita debug javascript completo",
	"0029"	=>	"Base URL per il caricamento di script proprietari",
	"0030"	=>	"Impostazioni specifiche del portale",
	"0031"	=>	"Abilita la cache di avvio",
	"0032"	=>	"Lascia il sito in manutenzione dopo l'installazione",
	"0033"	=>	"Messaggio personalizzato in modalità di manutenzione",
	"0034"	=>	"Tempo di vita della cache",
	"0035"	=>	"Abilita la cache",
	"0036"	=>	"Abilita il log degli eventi",
	"0037"	=>	"Impostazioni di autenticazione e registrazione",
	"0038"	=>	"",
	"0039"	=>	"Modalità di registrazione autonoma dei nuovi utenti",
	"0040"	=>	"Abilita cache delle autenticazioni esterne (ldap/autenticatore esterno)",
	"0041"	=>	"",
	"0042"	=>	"",
	"0043"	=>	"",
	"0044"	=>	"Supporto mappe (gmaps)",
	"0045"	=>	"Abilita supporto mappe",
	"0046"	=>	"",
	"0047"	=>	"Abilita supporto sensore",
	"0048"	=>	"API key",
	"0049"	=>	"",
	"0050"	=>	"",
	"0051"	=>	"",
	"0052"	=>	"TTL della cache di autenticazione",
	"0053"	=>	"Abilita autenticatore locale (per accettare richieste di autenticazione esterne)",
	"0054"	=>	"Modalità dell'autenticatore locale",
	"0055"	=>	"Chiave condivisa dell'autenticatore locale",
	"0056"	=>	"Impostazioni di posta (smtp)",
	"0057"	=>	"Indirizzo del server di posta",
	"0058"	=>	"Porta su cui è in ascolto il server di posta",
	"0059"	=>	"Usa autenticazione cifrata",
	"0060"	=>	"Nome utente smtp",
	"0061"	=>	"Password smtp",
	"0062"	=>	"Indirizzo da cui inoltrare le mail",
	"0063"	=>	"Motore mail da utilizzare",
	"0064"	=>	"La registrazione richiede l'autorizzazione si un amministratore",
	"0065"	=>	"Ruolo predefinito per i nuovi utenti",
	"0066"	=>	"Filtro di default per la ricerca utenti su ldap",
	"0067"	=>	"Protocollo di sicurezza",
	"0068"	=>	"Nome dell'utente amministratore",
	
	"0069"	=>	"Percorsi delle cartelle di sistemaATTENZIONE: per alcuni di questi percorsi la procedura d installazione, per motivi di sicurezza, genera automaticamente dei percorsi randomici; si consiglia di non modificare questi valori in ambienti di produzione.",
	"0070"	=>	"Configurazione",
	"0071"	=>	"Applicazioni",
	"0072"	=>	"Home utenti",
	"0073"	=>	"File temporanei",
	"0074"	=>	"Database su file (sqlite)",
	"0075"	=>	"Cache",
	"0076"	=>	"Miniature immagini",
	"0077"	=>	"Comodojo Services",
	"0078"	=>	"Cron Scripts",
	
	"0079"	=>	"Cross domain external CDN",
	"0080"	=>	"Percorso di sistema",
	"0081"	=>	"Url del sito",
	"0082"	=>	"Url esterna del sito (se differente da quella principale)",
	"0083"	=>	"Encoding globale",
	"0084"	=>	"Id del contenitore di default",
	"0085"	=>	"Abilita il debug del backend (PHP)",
	"0086"	=>	"Livello di debug del backend",
	"0087"	=>	"Abilita il trasporto per sessione",
	"0088"	=>	"Autentica ogni sessione (ATTENZIONE! Se abilitato, comodojo non preserverà le sessioni autenticate tramite LDAP!)",
	"0090"	=>	"Tema del sito",
	"0091"	=>	"Impostazioni di debug (client and server)",
	
	"0092"	=>	"Solo utenti locali",
	"0093"	=>	"Autenticazione tramite LDAP filtrata (gli utenti locali sono preservati)",
	"0094"	=>	"Autenticazione tramite LDAP non filtrata (gli utenti locali sono preservati, ma verrà creato un utente locale se già definito su LDAP)",
	"0095"	=>	"Autenticazione tramite RPC esterno (gli utenti locali sono preservati)",
	
	"0096"	=>	"Gli utenti possono registrarsi al sito",
	"0097"	=>	"Gli utenti non possono registrarsi al sito",
	
	"0098"	=>	"",
	"0099"	=>	"Trasporto abilitato per il server RPC locale",
	"0100"	=>	"Server RPC locale",
	
	"0101"	=>	"La versione del PHP installata sul tuo server è supportata.",
	"0102"	=>	"Non è possibile installare comodojo, la versione del PHP installata non è supportata.",
	"0103"	=>	"Le librerie GD sono installate correttamente.",
	"0104"	=>	"Non sono installate le librerie GD. Alcune funzioni sulle immagini non saranno disponibili.",
	"0105"	=>	"La cartella '/comodojo/configuration' è scrivibile.",
	"0106"	=>	"La cartelle '/comodojo/configuration' non è scrivibile; correggi i permessi e ripeti la verifica.",
	"0107"	=>	"La cartella '/home' è scrivibile.",
	"0108"	=>	"La cartelle '/home' non è scrivibile; correggi i permessi e ripeti la verifica.",
	"0109"	=>	"Ripeti verifica",
	"0110"	=>	"",
	"0111"	=>	"La cartella '/home' è vuota.",
	"0112"	=>	"Installa comodojo",
	"0113"	=>	"Il database è stato inizializzato correttamente.",
	"0114"	=>	"Il database non è stato inizializzato correttamente.<br/>",
	"0115"	=>	"I valori di base del portale sono stati scritti con successo nel database!",
	"0116"	=>	"Non è stato possibile scrivere in maniera corretta i valori di base del portale nel database!",
	"0117"	=>	"Il file di configurazione è stato scritto correttamente.",
	"0118"	=>	"Non è stato possibile scrivere il file di configurazione!",
	"0119"	=>	"L'installazione è terminata in modo anomalo: ripeti la procedura abilitando il log.",
	"0120"	=>	"Installazione fallita",
	"0121"	=>	"L'istallazione è andata a buon fine! Ricorda di cambiare la password di amministrazione al primo accesso:",
	"0122"	=>	"Vai al portale",
	"0123"	=>	"Installazione terminata",
	"0124"	=>	"Indirizzo mail dell'utente amministratore",
	"0125"	=>	"La cartella '/home' non è vuota. Andando avanti, si rischia di perdere parte del contenuto.",
	
	"0126"	=>	"CRON abilitato",
	"0127"	=>	"Modalità multi-thread",
	"0128"	=>	"Notifiche di riepilogo via email",
	"0129"	=>	"Notifica a (usa ; per separare gli indirizzi)",
	"0130"	=>	"Cron Jobs",
	
	"0131"	=>	"Servizi REST",
	"0132"	=>	"Attiva servizi REST",
	"0133"	=>	"Shell locale",
	"0134"	=>	"Abilita shell locale",
	"0135"	=>	"Cartella home",
	"0136"	=>	"",
	
	"0137"	=>	"Gravatar rating",
	
	"0138"	=>	"Tempo di scadenza delle richieste di registrazione",
	
	"0200"	=>	"Si",
	"0201"	=>	"No",
	
	
);

?>