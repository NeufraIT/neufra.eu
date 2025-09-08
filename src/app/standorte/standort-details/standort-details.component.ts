import { Component, Inject, isDevMode, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BranchInfo, PersonelInfo } from 'src/app/model/data.model';
import { CsvService } from 'src/app/shared/csv.service';
import { ADDITIONAL_DATA } from 'src/assets/files/additional-data';
@Component({
	selector: 'app-standort-details',
	templateUrl: './standort-details.component.html',
	styleUrls: ['./standort-details.component.scss']
})
export class StandortDetailsComponent implements OnInit {
	branch: BranchInfo[] = [];
	nationalDisposition: PersonelInfo[] = [];
	internationalDisposition: PersonelInfo[] = [];
	importDisposition: PersonelInfo[] = [];
	exportDisposition: PersonelInfo[] = [];
	management: PersonelInfo[] = [];
	executiveManagement: PersonelInfo[] = [];
	humanResources: PersonelInfo[] = [];
	accounting: PersonelInfo[] = [];
	branchPhonePrefix: string | undefined;
	centralAccounting: PersonelInfo[] = [];
	urlPrefix = isDevMode() ? '../../../' : './';
	showAdditionalData = false;
	additonalData: { management: string[], court?: string, headquarters?: string, taxNumber?: string, vtaNumber?: string, companyRegistrationNumber?: string, text?: string[] };

	captcha: string;
	email: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { location: string },
		private csvService: CsvService
	) {
		this.captcha = '';
		this.email = 'neuss@neufra.eu';
	}

	ngOnInit(): void {
		this.getLocationDetails();

	}

	getLocationDetails() {
		this.csvService.getLocationDetails(this.data.location).subscribe(data => {
			data = data.split('new line ,').join('new line,');
			const stringList = data.split('new line,');
			stringList.shift();

			this.branch = stringList.filter(x => x.includes('Niederlassungsleitung')).map(x => this.getBranchInfo(x, ));
			this.branchPhonePrefix = this.branch[0].phone?.trim().slice(0, -1);
			const dataList = stringList.filter(x => !x.includes('Niederlassungsleitung')).map(x => x.split(','));

			const departments = new Set(dataList.map(x => x[1]));
			const sortedList: any[] = [];
			departments.forEach(x => {
				sortedList.push({ department: x, section: '', name: [], email: [], phone: [], hotline: [], phoneSuffix: [] })
			});

			dataList.forEach(x => {
				const member = sortedList.find(m => m.department === x[1]);
				member.section = x[0];
				const name = x[2].slice(4, x[2].length - 1);
				const gender = x[2].slice(0, 3);
				member.name.push({ 'firstnameAndLastname': name, 'gender': gender });
				member.email.push(!(x[2].includes('Wolfgang Hast') || x[2].includes('Sandra Hast-Herrendorf')) ?
					this.getEmail(x[2]) : '');
				member.phoneSuffix.push(x[3]);
				member.phone.push(this.formatNumber((this.branchPhonePrefix + x[3])));
			});

			this.nationalDisposition = sortedList.filter(x => x.section.trim() === 'Disposition National');
			this.internationalDisposition = sortedList.filter(x => x.section.trim() === 'Disposition International');
			this.importDisposition = sortedList.filter(x => x.section.trim() === 'Import');
			this.exportDisposition = sortedList.filter(x => x.section.trim() === 'Export');
			this.management = sortedList.filter(x => x.section.trim() === 'Verwaltung');
			this.executiveManagement = sortedList.filter(x => x.section.trim() === 'Geschäftsleitung');
			this.humanResources = sortedList.filter(x => x.section.trim() === 'Personalabteilung');
			this.accounting = sortedList.filter(x => x.section.trim() === 'Buchhaltung');
			this.centralAccounting = sortedList.filter(x => x.section.trim() === 'Zentralbuchhaltung');
			this.showAdditionalData = ['Poznan', 'Decin', 'Budapest', 'Wien', 'Barcelona', 'Verona', 'NEU'].includes(this.data.location);
			if (this.showAdditionalData) {
				this.additonalData = ADDITIONAL_DATA[`${this.data.location}`];
			}
		});
	}

	getNameOfTheCompany() {
		switch (this.data.location) {
			case 'Mailand':
			case 'Verona':
				return 'Neufra Spedizioni Italia s.r.l.';
			case 'Wien':
			case 'Bregenz':
			case 'Linz':
				return 'NEUFRA Speditions Ges.m.b.H.';
			case 'Poznan':
				return 'NEUFRA Spedition Polska sp. z o.o.';
			case 'Barcelona':
				return 'Neufra Logistica Espana S.L.';
			case 'Budapest':
				return 'NEUFRA Hungary Szállítmányozási KFT';
			case 'Decin':
				return 'NEUFRA spedice s.r.o.';
			default:
				return 'NEUFRA Speditions GmbH';
		}
	}

	getBranchInfo(info: string) {
		const branch = info.replace(`Niederlassungsleitung,`, '').split(',');
		return {
			address: branch[0].split('/')[0].trim(),
			city: branch[0].split('/')[1],
			leader: branch[1],
			email: this.getEmail(branch[1]),
			phone: branch[2].trim(),
			fax: branch[3].trim()
		}
	}

	getEmail(input: string) {
		const name = input.trim()
			.replace('Hr. ', '')
			.replace('Fr. ', '')
			.replace('von ', '')
			.toLowerCase()
			.split('ö').join('oe')
			.split('ü').join('ue')
			.split('ä').join('ae')
			.split('ß').join('ss')
			.split(' ').join('.')
			.split('á').join('a')
			.split('ř').join('r')
			.split('č').join('c');
		return (name + '@neufra.eu');
	}

	formatNumber(numberStr: string) {
		const number = numberStr.split(' ').join('').split('-').join('');
		return number.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/g, "$1 $2 $3 - $4 $5 - ");
	}

	resolved(captchaResponse: string) {
        this.captcha = captchaResponse;
        console.log('resolved captcha with response: ' + this.captcha);
    }
}
