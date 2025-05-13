import { defineStore } from 'pinia';

export const useF24Store = defineStore('f24', {
  state: () => ({
    f24Ordinary: {
      // Dati del contribuente
      taxpayerType: 'person', // person o company
      fiscalCode: '',
      companyName: '',
      lastName: '',
      firstName: '',
      birthDate: '',
      birthPlace: '',
      sex: '',
      
      // Sezione Erario
      treasurySection: [
        {
          id: 1,
          tributeCode: '',
          referenceYear: '',
          debitAmount: '',
          creditAmount: ''
        }
      ],
      
      // Sezione INPS
      inpsSection: [
        {
          id: 1,
          inpsCode: '',
          inpsReason: '',
          inpsFrom: '',
          inpsTo: '',
          debitAmount: '',
          creditAmount: ''
        }
      ],
      
      // Sezione Regioni
      regionsSection: [
        {
          id: 1,
          regionCode: '',
          regionTributeCode: '',
          referenceYear: '',
          debitAmount: '',
          creditAmount: ''
        }
      ],
      
      // Sezione Locali
      localTaxesSection: [
        {
          id: 1,
          municipalityCode: '',
          municipalityTributeCode: '',
          referenceYear: '',
          debitAmount: '',
          creditAmount: ''
        }
      ],
      
      // Dettagli pagamento
      paymentDate: '',
      totalDebit: 0,
      totalCredit: 0,
      balance: 0
    },
    
    f24Simplified: {
      // Stato simile ma con campi diversi per il modello semplificato
      // ...
    }
  }),
  
  getters: {
    // Calcola l'importo totale a debito per la sezione Erario
    treasuryDebitTotal: (state) => {
      return state.f24Ordinary.treasurySection.reduce((total, item) => {
        const amount = parseFloat(item.debitAmount) || 0;
        return total + amount;
      }, 0).toFixed(2);
    },
    
    // Calcola l'importo totale a credito per la sezione Erario
    treasuryCreditTotal: (state) => {
      return state.f24Ordinary.treasurySection.reduce((total, item) => {
        const amount = parseFloat(item.creditAmount) || 0;
        return total + amount;
      }, 0).toFixed(2);
    },
    
    // Calcola l'importo totale a debito per tutte le sezioni
    totalDebitAmount: (state) => {
      let total = 0;
      
      // Somma sezione Erario
      total += state.f24Ordinary.treasurySection.reduce((sum, item) => {
        return sum + (parseFloat(item.debitAmount) || 0);
      }, 0);
      
      // Somma sezione INPS
      total += state.f24Ordinary.inpsSection.reduce((sum, item) => {
        return sum + (parseFloat(item.debitAmount) || 0);
      }, 0);
      
      // Somma sezione Regioni
      total += state.f24Ordinary.regionsSection.reduce((sum, item) => {
        return sum + (parseFloat(item.debitAmount) || 0);
      }, 0);
      
      // Somma sezione Locali
      total += state.f24Ordinary.localTaxesSection.reduce((sum, item) => {
        return sum + (parseFloat(item.debitAmount) || 0);
      }, 0);
      
      return total.toFixed(2);
    },
    
    // Calcola l'importo totale a credito per tutte le sezioni
    totalCreditAmount: (state) => {
      let total = 0;
      
      // Somma sezione Erario
      total += state.f24Ordinary.treasurySection.reduce((sum, item) => {
        return sum + (parseFloat(item.creditAmount) || 0);
      }, 0);
      
      // Somma sezione INPS
      total += state.f24Ordinary.inpsSection.reduce((sum, item) => {
        return sum + (parseFloat(item.creditAmount) || 0);
      }, 0);
      
      // Somma sezione Regioni
      total += state.f24Ordinary.regionsSection.reduce((sum, item) => {
        return sum + (parseFloat(item.creditAmount) || 0);
      }, 0);
      
      // Somma sezione Locali
      total += state.f24Ordinary.localTaxesSection.reduce((sum, item) => {
        return sum + (parseFloat(item.creditAmount) || 0);
      }, 0);
      
      return total.toFixed(2);
    },
    
    // Calcola il saldo (debito - credito)
    balance: (state, getters) => {
      const totalDebit = parseFloat(getters.totalDebitAmount);
      const totalCredit = parseFloat(getters.totalCreditAmount);
      return (totalDebit - totalCredit).toFixed(2);
    }
  },
  
  actions: {
    // Aggiunge una nuova riga nella sezione Erario
    addTreasuryRow() {
      const newId = this.f24Ordinary.treasurySection.length > 0 
        ? Math.max(...this.f24Ordinary.treasurySection.map(item => item.id)) + 1 
        : 1;
        
      this.f24Ordinary.treasurySection.push({
        id: newId,
        tributeCode: '',
        referenceYear: '',
        debitAmount: '',
        creditAmount: ''
      });
    },
    
    // Rimuove una riga dalla sezione Erario
    removeTreasuryRow(id) {
      this.f24Ordinary.treasurySection = this.f24Ordinary.treasurySection.filter(item => item.id !== id);
    },
    
    // Aggiunge una nuova riga nella sezione INPS
    addInpsRow() {
      const newId = this.f24Ordinary.inpsSection.length > 0 
        ? Math.max(...this.f24Ordinary.inpsSection.map(item => item.id)) + 1 
        : 1;
        
      this.f24Ordinary.inpsSection.push({
        id: newId,
        inpsCode: '',
        inpsReason: '',
        inpsFrom: '',
        inpsTo: '',
        debitAmount: '',
        creditAmount: ''
      });
    },
    
    // Rimuove una riga dalla sezione INPS
    removeInpsRow(id) {
      this.f24Ordinary.inpsSection = this.f24Ordinary.inpsSection.filter(item => item.id !== id);
    },
    
    // Aggiunge una nuova riga nella sezione Regioni
    addRegionRow() {
      const newId = this.f24Ordinary.regionsSection.length > 0 
        ? Math.max(...this.f24Ordinary.regionsSection.map(item => item.id)) + 1 
        : 1;
        
      this.f24Ordinary.regionsSection.push({
        id: newId,
        regionCode: '',
        regionTributeCode: '',
        referenceYear: '',
        debitAmount: '',
        creditAmount: ''
      });
    },
    
    // Rimuove una riga dalla sezione Regioni
    removeRegionRow(id) {
      this.f24Ordinary.regionsSection = this.f24Ordinary.regionsSection.filter(item => item.id !== id);
    },
    
    // Aggiunge una nuova riga nella sezione Locali
    addLocalTaxRow() {
      const newId = this.f24Ordinary.localTaxesSection.length > 0 
        ? Math.max(...this.f24Ordinary.localTaxesSection.map(item => item.id)) + 1 
        : 1;
        
      this.f24Ordinary.localTaxesSection.push({
        id: newId,
        municipalityCode: '',
        municipalityTributeCode: '',
        referenceYear: '',
        debitAmount: '',
        creditAmount: ''
      });
    },
    
    // Rimuove una riga dalla sezione Locali
    removeLocalTaxRow(id) {
      this.f24Ordinary.localTaxesSection = this.f24Ordinary.localTaxesSection.filter(item => item.id !== id);
    },
    
    // Resetta il form
    resetForm() {
      this.f24Ordinary = {
        taxpayerType: 'person',
        fiscalCode: '',
        companyName: '',
        lastName: '',
        firstName: '',
        birthDate: '',
        birthPlace: '',
        sex: '',
        
        treasurySection: [
          {
            id: 1,
            tributeCode: '',
            referenceYear: '',
            debitAmount: '',
            creditAmount: ''
          }
        ],
        
        inpsSection: [
          {
            id: 1,
            inpsCode: '',
            inpsReason: '',
            inpsFrom: '',
            inpsTo: '',
            debitAmount: '',
            creditAmount: ''
          }
        ],
        
        regionsSection: [
          {
            id: 1,
            regionCode: '',
            regionTributeCode: '',
            referenceYear: '',
            debitAmount: '',
            creditAmount: ''
          }
        ],
        
        localTaxesSection: [
          {
            id: 1,
            municipalityCode: '',
            municipalityTributeCode: '',
            referenceYear: '',
            debitAmount: '',
            creditAmount: ''
          }
        ],
        
        paymentDate: '',
        totalDebit: 0,
        totalCredit: 0,
        balance: 0
      };
    }
  }
});