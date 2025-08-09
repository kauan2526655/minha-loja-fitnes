class EarningsCalculator {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.totalPausedTime = 0;
        this.interval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateCalculations();
    }

    initializeElements() {
        this.dailyValueInput = document.getElementById('dailyValue');
        this.workHoursInput = document.getElementById('workHours');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerStatus = document.getElementById('timerStatus');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.currentEarnings = document.getElementById('currentEarnings');
        
        this.perSecond = document.getElementById('perSecond');
        this.perMinute = document.getElementById('perMinute');
        this.perHour = document.getElementById('perHour');
        this.perDay = document.getElementById('perDay');
    }

    bindEvents() {
        this.dailyValueInput.addEventListener('input', () => this.updateCalculations());
        this.workHoursInput.addEventListener('input', () => this.updateCalculations());
        
        this.playBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
    }

    updateCalculations() {
        const dailyValue = parseFloat(this.dailyValueInput.value) || 0;
        const workHours = parseFloat(this.workHoursInput.value) || 8;
        
        const hourlyRate = dailyValue / workHours;
        const minuteRate = hourlyRate / 60;
        const secondRate = minuteRate / 60;
        
        this.perSecond.textContent = this.formatCurrency(secondRate);
        this.perMinute.textContent = this.formatCurrency(minuteRate);
        this.perHour.textContent = this.formatCurrency(hourlyRate);
        this.perDay.textContent = this.formatCurrency(dailyValue);
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now();
            this.totalPausedTime = 0;
            this.isRunning = true;
        } else if (this.isPaused) {
            this.totalPausedTime += Date.now() - this.pausedTime;
            this.isPaused = false;
        }

        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;
        this.timerStatus.textContent = 'Trabalhando...';

        this.interval = setInterval(() => this.updateTimer(), 1000);
    }

    pause() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            this.pausedTime = Date.now();
            clearInterval(this.interval);
            
            this.playBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.timerStatus.textContent = 'Em pausa';
        }
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.totalPausedTime = 0;
        
        clearInterval(this.interval);
        
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stopBtn.disabled = true;
        
        this.timerDisplay.textContent = '00:00:00';
        this.timerStatus.textContent = 'Pronto para iniciar';
        this.currentEarnings.textContent = 'R$ 0,00';
    }

    updateTimer() {
        if (!this.isRunning || this.isPaused) return;

  