import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CsvService } from '../shared/csv.service';
import { ScriptService } from '../shared/script.service';
import { SharedService } from '../shared/shared.service';
import { WindowScrollingService } from '../shared/window-scrolling.service';
import { environment } from './../../environments/environment';
import { StandortDetailsComponent } from './standort-details/standort-details.component';
declare let locations: any;
declare let inputData: any;
declare let inputCode: any;
@Component({
	selector: 'app-standorte',
	templateUrl: './standorte.component.html',
	styleUrls: ['./standorte.component.scss']
})
export class StandorteComponent implements OnInit, AfterViewChecked, OnDestroy {
	urlPrefix = environment.urlPrefix;
	@ViewChild('mapContainer') mapContainer: ElementRef;
	anchor: string;
	sub: Subscription;

	constructor(
		private matDialog: MatDialog,
		private renderer: Renderer2,
		private scriptService: ScriptService,
		private csvService: CsvService,
		private translate: TranslateService,
		private windowScrollingService: WindowScrollingService,
		private activatedRoute: ActivatedRoute,
		private sharedService: SharedService,
		@Inject(DOCUMENT) private document: Document
	) {
		translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.loadMap();
		});
	}

	ngOnInit(): void {
		this.loadMap();

		this.sub = this.activatedRoute.fragment.subscribe(fragment => {
			this.anchor = fragment ? fragment : '';
		});

		if (this.sharedService.isMobileDevice() && !this.sharedService.infoSeen) {
			this.windowScrollingService.enableFreeze();
		}
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	ngAfterViewChecked(): void {
		if (this.anchor && this.sharedService.infoSeen) {
			this.document.querySelector('#' + this.anchor)?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	loadMap() {
		this.csvService.getLocationList().subscribe(data => {
			const locationsList = data.split('\n');
			locationsList.shift();
			locations = [];
			inputCode = JSON.parse(JSON.stringify(inputData));
			locationsList.forEach((x, index) => {
				const translatedName = this.translate.instant('locations.branch.' + x.split(',')[0]);
				locations.push({
					name: translatedName,
					x: + x.split(',')[1],
					y: + x.split(',')[2],
					abr: x.split(',')[3].trim(),
					id: index
				})
			});

			const inputMapObj = this.scriptService.loadJsScript(this.renderer, (this.urlPrefix + 'assets/image-map-pro/location-list.js'));
			inputMapObj.onload = () => {
				this.scriptService.loadJsScript(this.renderer, (this.urlPrefix + 'assets/image-map-pro/map.js'));
			}
		});
	}

	showLocationDetails(location: any) {
		const dialogRef = this.matDialog.open(StandortDetailsComponent, {
			data: { location: location },
			panelClass: 'dialog'
		});
	}
}
